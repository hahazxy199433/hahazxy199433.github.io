# PHP学习(三) php面向对象介绍


## 什么是类？
**具有相同属性(特征)和方法(行为)的一系列个体的集合，类是一个抽象的概念**
## 什么是对象？
**从类中拿到的具有具体属性值得个体，称为对象，对象是一个具体的个体。
所以，面向对象即我们专注对象来处理问题，通过从一个个具有属性和功能的类中拿到对象来处理问题。**
## 软件工程学
**软件工程学士一门研究用工程化方法构建和维护有效的、实用的和高质量的软件的学科，它涉及到程序设计语言、数据库、软件开发工具、系统换平台、标准、设计模式等方法。**
**分为结构化方法（按软件周期分为三个阶段：分析、设计、编程）和面向对象**

**三个目标：**
+ **重用性**
+ **灵活性**
+ **扩展性**

## 面向对象编程OOP（Object-Oriented Programming）
**使其编程的代码更简洁、更易于维护，并且具有更强的可重用性。**

**面向对象编程的特点：**
+ **封装**
+ **继承**
+ **多态**

 **面向对象的三个主要特性：**
+ **对象的行为**
+ **对象的状态**
+ **对象的标识**

## 类的声明
### 类的声明
```php
// 简单格式
     [修饰符] class  类名{   //使用class关键字加空格后加上类名            修饰符表示这个类是私有的，还是公有的
            [成员属性]      //也叫成员变量
            [成员方法]      //也叫成员函数
    }
// 完整格式
     [修饰符] class 类名 [extends 父类] [implements 接口1[,接口2...]]{
            [成员属性]  //也叫成员变量
            [成员方法] // 也叫成员函数
     }
```

### 成员属性
```php
// 格式：修饰符 $变量名[= 默认值]；例如：public $name = "张三";
// 注意：成员属性不可以是带运算符的表达式、变量、方法或函数调用。
    // 错误的形式
        public $var3 = 1 + 2; //错误
        public $var4 = self::myStaticMethod();      //错误
        public $var5 = $myVar;      //错误
    // 正确的形式
        public $var6 =100;      // 普通数值（4个标量：整数，浮点数，布尔，字符串）
        public $var6 = myConstant;  //常量
        public $var7 = self::classConstant // 静态属性，自己的属性
        public $var8 = array(true,false);   // 数组
```
### 成员方法
```php
// 成员方法格式：
[修饰符] function 方法名(参数...) {
    [方法体]
    [return 返回值]
}
// 例如
    public function say(){      // 人可以说话的方法
        echo "hello world" ;        // 方法体
    }
```

### 实例化对象
```php
$对象名称 = new 类名称();
$对象名称 = new 类名称([参数列表]);
```

### 对象中成员的访问
```php
// 语法：
    $引用名 = new 类名(构造参数)         实例对象
    $引用名->成员属性 = 赋值          对象属性赋值
    echo 引用名-> 成员属性        输出对象的属性
    $引用名->成员方法(参数)    调用对象的方法
```
### 特殊对象引用$this
```php
// 例如
    public function play(){
        echo "正在玩手机";
    }
    public function info(){
        $this -> play();
        return "手机的宽度:{$this -> width}, 手机的高度：{$this -> height}";
    }
```

### 实例
```php
<?php
class Person {
    // 成员变量
    public $age;
    // 成员函数
    public function say($word) {
        echo "she say {$word}";
    }
    public function info() {
        $this -> say("hi");
        return $this -> age;
    }
}
$xiaohong = new Person();
$xiaohong -> age = 23;// 给实例的age属性赋值
$age = $xiaohong -> info();// 调用实例的info方法
echo '<br/>';
echo $age;
?>
```
