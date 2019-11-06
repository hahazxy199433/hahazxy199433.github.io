# React 源码解读（二） Fiber Root



在react 16之前，组件渲染是不能被打断的，这就导致当项目非常大的时候，只能等待渲染完才能做其他事。
而在 16 之后，React.render 新增了 fiber 机制。
可以在更新过程中中断任务来执行优先级更高的任务。


fiber 分为两个阶段
+ **reconciliation** 阶段
fiberNode为单位，调度的时候，每更新一个fiber，返回去询问，是否有优先级更高的任务，接下来的任务会中断，不会实际渲染到页面，update，打上 effectTag
+ **commit** 阶段
处理这些标记，渲染到页面，这个过程是不能被打断的


它的流程具体是怎么样的?
优先级更高的任务，如何判断优先级?

## 创建 FiberRoot
顺着流程走，代码会在 ReactDOM.render 中执行
在源码中可以看到依次执行了以下几个方法

+ legacyRenderSubtreeIntoContainer
+ legacyCreateRootFromDOMContainer
+ ReactRoot
+ 进入 react-reconciler 库
  + 具体通过 createContainer -> createFiberRoot 创建 fiberRoot。



**legacyRenderSubtreeIntoContainer**
```js
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,  // forceHydrate 的作用是是否需要复用节点，在服务端渲染中它会被设为true
  callback: ?Function,
) {

  let root: Root = (container._reactRootContainer: any);
  // 第一次root 不存在
  if (!root) {
    // Initial mount  
    // 创建reactRoot，在dom元素上挂载, 
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
  }
  // Initial mount should not be batched.
    // 首次不用批量更新， batchedUpdate是等view更新完之后在去统一更新状态，
    // 有一个等待的过程， 第一次不需要，可以更快
    unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer(
          parentComponent,
          children,
          callback,
        );
      } else {
        // ReactRoot.prototype.render
        root.render(children, callback);
      }
    });
  // 省略代码
}
```
在 legacyRenderSubtreeIntoContainer 方法中，第一次root 不存在时，创建了reactRoot 在dom元素上挂载
forceHydrate 参数被传入到了 legacyCreateRootFromDOMContainer中

**legacyCreateRootFromDOMContainer**
```js
function legacyCreateRootFromDOMContainer(
  container: DOMContainer,
  forceHydrate: boolean,
): Root {
  // 是否需要复用节点
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    // 删除子节点
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }
  // Legacy roots are not async by default.
  const isConcurrent = false;
  // 返回一个新创建的ReactRoot
  return new ReactRoot(container, isConcurrent, shouldHydrate);
}
```

ReactRoot 通过 createContainer 创建了 FiberRoot
**ReactRoot**
```js
function ReactRoot(
  container: DOMContainer,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  // 创建FiberRoot
  const root = createContainer(container, isConcurrent, hydrate);
  // 把创建的节点绑在_internalRoot属性上
  this._internalRoot = root;
}
```

创建fiber tree 的过程

![cmd-react-children](library-react-tree-demo-Fiber.png)

这里我们再来捋一下

ReactDOM.render 通过 legacyCreateRootFromDOMContainer 创建了 ReactRoot

ReactRoot 又创建了 FiberRoot

FiberRoot 又有如下几个比较重要的属性
+ current
+ containerInfo
+ finishedWork 在reconciliation 阶段，把一个update 推到 finishedWork，在 commit 阶段处理它
+ expirationTime



## expirationTime

ReactRoot.prototype.render => updateContainer() => ExpirationTime
render 的过程中调用了 updateContainer，和前面 createContainer 相对应，进行更新操作，而 updateContainer 返回的是个 ExpirationTime

**updateContainer**
```js
// updateContainer为啥返回一个ExpirationTime？
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  
  const current = container.current;
  // 通过 msToExpirationTime 得到currentTime
  const currentTime = requestCurrentTime();
  // 根据给任务分优先级，来得到不同的过期时间
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}
```

在返回之前先获取了 expirationTime
那就先看看 expirationTime 是什么
computeExpirationForFiber => 计算不同的过期时间
找到 computeExpirationForFiber 方法

这里有一个设置优先级的操作，也就是 getCurrentPriorityLevel，这里最后又调到了 Scheduler.js 的东西，也是 Scheduler 中最重要的部分

通过设置了5个等级的优先级，分别对应着超时时间，优先级越高，ExpirationTime 超时时间越低

**Scheduler.js**
```js
// TODO: Use symbols?
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var maxSigned31BitInt = 1073741823;

// Times out immediately, 比0还小，立即执行
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY = maxSigned31BitInt;
```

下面是 computeExpirationForFiber 方法，用来计算不同的过期时间

**computeExpirationForFiber**
```js
// 计算不同的过期时间
function computeExpirationForFiber(currentTime: ExpirationTime, fiber: Fiber) {
  // var ImmediatePriority = 1; 最高优先级， 直接走messageChannel 直接处理
  // var UserBlockingPriority = 2;
  // var NormalPriority = 3;  默认
  // var LowPriority = 4;
  // var IdlePriority = 5;
  // 优先级越高，ExpirationTime 超时时间越低
  const priorityLevel = getCurrentPriorityLevel();

  let expirationTime;
  if ((fiber.mode & ConcurrentMode) === NoContext) {
    // Outside of concurrent mode, updates are always synchronous.
    // 在并发模式之外，更新始终是同步的。
    expirationTime = Sync;
    // isWorking 在renderRoot或者CommitRoot
    // isCommitting CommitRoot
  } else if (isWorking && !isCommitting) {
    // isWorking 在 commitRoot 和 renderRoot 时被设置为true
    // isCommitting 在 commitRoot 时被设置为true
    // 所以在render阶段，优先级 expirationTime 设置为下次渲染的到期时间
    // During render phase, updates expire during as the current render.
    expirationTime = nextRenderExpirationTime;
  } else {
    // 在commit阶段，根据priorityLevel进行expirationTime更新
    switch (priorityLevel) {
      case ImmediatePriority:
        // 立即执行
        expirationTime = Sync;
        break;
      case UserBlockingPriority:
        // 因用户交互阻塞的优先级
        expirationTime = computeInteractiveExpiration(currentTime);
        break;
      case NormalPriority:
        // 一般，默认优先级， 异步执行
        // This is a normal, concurrent update
        expirationTime = computeAsyncExpiration(currentTime);
        break;
      case LowPriority:
      case IdlePriority:
        // 低优先级或空闲状态
        expirationTime = Never;
        break;
      default:
        invariant(
          false,
          'Unknown priority level. This error is likely caused by a bug in ' +
            'React. Please file an issue.',
        );
    }

    // If we're in the middle of rendering a tree, do not update at the same
    // expiration time that is already rendering.
    // 下一个fiber存在，且当前的fiber的过期时间和下一个fiber的过期时间一致
    // 把当前的fiber的过期时间减1 
    // 避免在渲染树的时候同时去更新已经渲染的树
    if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
      expirationTime -= 1;
    }
  }

  // Keep track of the lowest pending interactive expiration time. This
  // allows us to synchronously flush all interactive updates
  // when needed.
  // TODO: Move this to renderer?
  // 记录下挂起的用户交互任务中expirationTime最短的一个，在需要时同步刷新所有交互式更新
  if (
    priorityLevel === UserBlockingPriority &&
    (lowestPriorityPendingInteractiveExpirationTime === NoWork ||
      expirationTime < lowestPriorityPendingInteractiveExpirationTime)
  ) {
    lowestPriorityPendingInteractiveExpirationTime = expirationTime;
  }

  return expirationTime;
}
```


下面再回到 updateContainer 方法（调来调去的有点乱）, 最后 return 了 updateContainerAtExpirationTime，updateContainerAtExpirationTime 又返回了 scheduleRootUpdate

updateContainer() => updateContainerAtExpirationTime() => scheduleRootUpdate()

**scheduleRootUpdate**

```js
function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // 新建一个update  createUpdate() 下面是它的返回值  可以理解为一个更新单元
  //   expirationTime: expirationTime,
  //   tag: UpdateState,
  //   payload: null,
  //   callback: null,
  //   next: null,
  //   nextEffect: null,
  const update = createUpdate(expirationTime);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    warningWithoutStack(
      typeof callback === 'function',
      'render(...): Expected the last optional `callback` argument to be a ' +
        'function. Instead received: %s.',
      callback,
    );
    update.callback = callback;
  }
  // 调用schedule的回调
  flushPassiveEffects();
  // 延迟创建update quenes, 并把update 更新到update quenes中
  // update 添加到 current.updateQuene.firstUpdate|lastUpdate
  enqueueUpdate(current, update);

  scheduleWork(current, expirationTime);

  return expirationTime;
}
```

## scheduleWork


**scheduleWork**
```js
function scheduleWork
(fiber: Fiber, expirationTime: ExpirationTime) {
  // 设置expirationTime & 返回root节点的Fiber对象
  const root = scheduleWorkToRoot(fiber, expirationTime);
  if (root === null) {
    return;
  }
  // isWorking 在render和commit两个阶段都会为true
  // 新的render过期时间不是noWork
  // 之前的过期时间大于现在新的过期时间
  // 表达的含义：当前没有任务在执行，之前执行过任务，同时当前的任务比之前执行的任务过期时间要小
  if (
    !isWorking &&
    // nextRenderExpirationTime 在初始的时候是noWork， 被设置后不再是noWork
    nextRenderExpirationTime !== NoWork &&
    // ExpirationTime时间越小， 优先级更高
    expirationTime > nextRenderExpirationTime
  ) {
    // This is an interruption. (Used for performance tracking.)
    // 中断了执行 ， 因为有优先级更高的任务进来了 
    // isWorking=false意味着，在上一个时间片执行完之后进这个判断，
    // 有更高优先级的任务，则中断了之前任务的执行
    interruptedBy = fiber;
    // 清空之前任务的的stack
    resetStack();
  }
  // 更新最近和最早的时间
  markPendingPriorityLevel(root, expirationTime);
  // 要么没有任何任务 要么有任务但处于commitRoot阶段
  if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit...
    !isWorking ||
    isCommitting ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root
  ) {
    const rootExpirationTime = root.expirationTime;
    requestWork(root, rootExpirationTime);
  }
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    // Reset this back to zero so subsequent updates don't throw.
    nestedUpdateCount = 0;
    invariant(
      false,
      'Maximum update depth exceeded. This can happen when a ' +
        'component repeatedly calls setState inside ' +
        'componentWillUpdate or componentDidUpdate. React limits ' +
        'the number of nested updates to prevent infinite loops.',
    );
  }
}
```

### requestWork

**requestWork**
```js
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
  // 把root添加到调度队列， 链表的形式
  addRootToSchedule(root, expirationTime);
  // 在render过程当中， 直接返回return
  // batchedUpdate 批处理  setState  isRendering=true   第二个setState
  // 不会出现频繁式的更新
  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
  }

  if (isBatchingUpdates) {
    
    // Flush work at the end of the batch.
    // 执行unbatchedUpdates()时会设置为true
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      // 立即执行更新
      performWorkOnRoot(root, Sync, false);
    }
    // 批处理 return 不执行
    return;
  }

  // TODO: Get rid of Sync and use current time?
  // 同步任务，直接执行
  if (expirationTime === Sync) {
    // 立即同步执行
    performSyncWork();
  } else {
    // 通过ExpirationTime 进行调度
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }
}
```

requestWork 是 scheduleWork 中的一个重点
其中主要分成了三个分支：

+ isRendering
+ isBatchingUpdates
+ expirationTime === Sync

我们来分别解释一下

**1. isRendering**

isRendering 顾名思义在render过程当中， 此时直接返回return。

batchedUpdate 批处理的时候，将 isRendering 置成 true，这样每次在执行 setState 时，都会走 isRendering 的分支直接返回，阻止更新，相当于暂停住，当第二个setState时依旧直接返回，避免出现频繁式的更新，也就是批处理。


**2. isBatchingUpdates**

isBatchingUpdates 中又有一个 isUnbatchingUpdates 分支。
isUnbatchingUpdates 会在执行 unbatchedUpdates() 时设置为true。
也就是在首次渲染的时候不需要进行批处理，所以就会进行立即更新

**3. expirationTime === Sync**

当前面的 expirationTime 被设置成了同步任务的时候，就会立即执行。
剩余的则会进入 scheduleCallbackWithExpirationTime 通过ExpirationTime 进行调度。

### performWorkOnRoot

再继续从 requestWork 深入，执行了 performWorkOnRoot 方法

**1. 首先进入先将 isRendering 置成true，告诉外面，现在要开始干活了，不要来打扰我**

**2. 判断是否是同步任务 if(!isYieldy)**

进入分支后，判断是否存在任务了，如果 finishedWork 存在，就进行 commit，也就是 completeRoot()
如果没有任务，这个Root，之前有暂停的话，清除掉这个定时器，会尝试继续渲染。
之后会继续进行判断。

总结起来两句话：

**通过是否存在 finishedWork 来判断是执行 commit 还是继续render**

**如果没有 finishedWork，执行 RenderRoot 后再判断是否执行 commit**

```js
    // update队列
    let finishedWork = root.finishedWork;
    // 判断是否存在任务了
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      // 存在任务了
      // finishedWork存在，进行commit了
      completeRoot(root, finishedWork, expirationTime);
    } else {
      // root.finishedWork 有可能是其他什么值 undefined 之类的，重新置成 null 没毛病
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      // 如果这个Root，之前有暂停，清除掉这个定时器，会尝试继续渲染
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      // 继续调度
      renderRoot(root, isYieldy);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Commit it.
        // 判断是否可以执行commit
        completeRoot(root, finishedWork, expirationTime);
      }
    }
```

**3. 否则就是异步任务**

跟同步的逻辑差不多

**4. 最后任务结束再将 isRendering 置成false**


#### renderRoot

再来看一下 performWorkOnRoot 中继续调度时调用的 renderRoot()

其中下面这段代码是在hooks的时候用的
```js
// 设置 ReactCurrentDispatcher， 包含所有hooks的实现
  const previousDispatcher = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;
```

再往下，判断是否有新的更新进来

```js
if (
    expirationTime !== nextRenderExpirationTime ||
    root !== nextRoot ||
    nextUnitOfWork === null
  ) 
```
进入 if 后

创建一个镜像Fiber，赋值给alternate属性。
WorkInProgress 是当前fiber对象的一个镜像，当再次进入时，Fiber发生了变化，直接与 WorkInProgress Fiber 对比。相当于缓存了之前更新的结果，并且放在了 Fiber.alternate 上面。同时将 Fiber 挂在 WorkInProgress Fiber上，进行了一个双缓存
```js
    // 重置
    resetStack();
    nextRoot = root;
    nextRenderExpirationTime = expirationTime;
    // 创建镜像Fiber， 赋值给alternate属性
    // 是当前fiber对象的一个镜像，WorkInProgress Fiber对象
    // Fiber发生了变化，直接与 WorkInProgress Fiber 对比
    // Fiber.alternate = WorkInProgress Fiber
    // WorkInProgress.alternate = Fiber
    nextUnitOfWork = createWorkInProgress(
      nextRoot.current,
      null,
      nextRenderExpirationTime,
    );
```

中间的逻辑忽略，继续向下找。 从这里开始了 workLoop，下面是一个do while(true)的大循环。
接下来就要进入到 workLoop 中去了。

```js
  startWorkLoopTimer(nextUnitOfWork);
  do {
    try {
      workLoop(isYieldy);
    } catch (thrownValue) {
      //......
    }
    break;
  } while (true);
```

#### workLoop

workLoop 中调用 performUnitOfWork，performUnitOfWork 中又调用了 beginWork
workLoop => performUnitOfWork => beginWork
那我们直接来看 beginWork 的逻辑

首先判断节点是否存在，然后进行新旧props判断。

接下来用switch case 来判断不同的 workInProgress.tag 来进行入栈操作
**beginWork**
```js
const updateExpirationTime = workInProgress.expirationTime;
  // 判断节点是否存在
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    // 前后props是否相等
    // 判断了是否有老版本context使用并且发生变化
    if (oldProps !== newProps || hasLegacyContextChanged()) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
      // 需要更新的优先级小于当前更新的优先级
    } else if (updateExpirationTime < renderExpirationTime) {
      didReceiveUpdate = false;
      // switch (workInProgress.tag) case
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderExpirationTime,
      );
    }
  } else {
    didReceiveUpdate = false;
  }
```

再接下来
```js
 // 在进入开始阶段之前，清除到期时间。
  workInProgress.expirationTime = NoWork;
  // 就根据不同的节点类型进行更新
  // 真正在这个下面的逻辑里面打上标签EffectTag, 将 update 加入到 updateQuene 中，产生 finishWork
  // update => updateQuene => finishWork
  switch (workInProgress.tag) {}
    // FunctionalComponent在第一次创建 Fiber 的时候就是 IndeterminateComponent
    // 会调到 reconcileChildren 这个方法， 判断是否能够复用，执行节点的更新
```

## 总结

![react-render 流程](react-render-core1.png)