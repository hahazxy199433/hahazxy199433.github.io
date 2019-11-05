# PHP学习(四) 构造方法和析构方法

### 构造方法
**在创建构造方法后，系统将自动调用构造方法！**

+ 一个类只能有一个构造方法！
+ 构造方法没有返回值。
+ 构造方法的作用是对新对象的初始化，但并不能创造对象本来、

### 析构方法
 **用途：可以进行资源的释放操作 数据库关闭**
 **对象被销毁的时候执行，没有代码再运行了**
+ 系统自动调用。
+ 主要用于释放资源
+ 析构函数调用的顺序，先创建的对象，先被销毁（最先创建的会被压栈）。
+ 当一个对象成为垃圾对象的时候，该析构函数会被立即调用。进程结束后退出！ 

### 实例
```php
<?php
class Person{
    public function __construct($name, $age) {
        // 当类new时自动执行
        echo "hello {$name}";
        $this -> name = $name;
        $this -> age = $age;
    }
    public function data() {
        return $this -> age;
    }
    public function __destruct() {
        // 用途：可以进行资源的释放操作 数据库关闭
        // 对象被销毁的时候执行，没有代码再运行了
        echo "bye bye {$this -> name}";
        echo '<br/>';
    }
}
new Person('xiaohong', 20);
new Person('xiaowang', 30);
?>
```
