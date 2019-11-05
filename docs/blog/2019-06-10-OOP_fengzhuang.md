# PHP学习(五) PHP面向对象之封装性

## 类的三大特性之一——封装性

**封装性**：将敏感的数据保护起来，不被外界访问；还可以理解为，将一个功能的方方面面，封装成一个整体，即类；
+ 类的封装性，是通过访问权限修饰符来实现的；
+ 在项目中，属性基本都是私有的。通过公有的方法，对私有的属性进行赋值和取值。
+ 类实现封装是为了不让外面的类随意的修改一个类的成员变量，所以在定义一个类的成员的时候，我们使用private关键字设置这个成员的访问权限；
+ 只能被这个类的其他成员方法调用，而不能被其他类中的方法调用，即通过本类中提供的方法来访问本类中的私有属性。

## 封装的修饰符

+ **public(公共的权限)**：在任何地方都可以被访问，主要是类内、类外、子类中都可以被访问。
+ **private(私有的权限)**：只能在本类中被访问，类外和子类中无权访问。
+ **protected(受保护的权限)**：只能在本类中和子类中被访问，在类外不能访问。

环境	| private |	protected | public
:-: | :-: | :-: | :-: | :-:
在同一类中 |	可以 |	可以	|可以
在子类中 |	不可以 |	可以	|可以
在类的外部|	不可以	|不可以	|可以


```php
<?php
class Person{
    public $name = 'xiaowang'; // 公有的
    private $age = '25'; // 私有的
    protected $money = 10; // 受保护的
    // 私有的成员方法， 外部不能随便访问
    private function getAge() {
        return $this -> age;
    }
    // 受保护的成员方法， 外部不能随便访问
    protected function getMoney() {
        return $this -> money;
    }
    // 公有的方法，外部可以访问
    public function userCard() {
    // 可以在内部访问私有方法
        echo "年龄:".$this -> getAge() ."存款:". $this -> getMoney();
    }
    
}
$xw = new Person();
$xw -> userCard();
?>
```

## 魔术方法
`魔术方法只针对`**protected**`或者`**private**`的属性！！`

### __set()：
这个方法用来为私有成员属性设置值的，有两个参数，第一个参数为你要为设置值的属性名，第二个参数是要给属性设置的值，没有返回值。
```php
class Person{
    public $name = 'xiaowang'; // 公有的
    private $age = '25'; // 私有的
    protected $money = 10; // 受保护的
    public function __set($key,$value){
    // 魔术方法的set只针对 protected或者private的属性
	    if($key == 'age' && $value > "18"){
	        $this -> age = "18";
	    }
	}
}
// set方法
$xw ->age = 18;
```

### __get()：
这个方法用来获取私有成员属性值的,有一个参数，参数传入你要获取的成员属性的名称，返回获取的属性值。

```php
class Person{
    public $name = 'xiaowang'; // 公有的
    private $age = '25'; // 私有的
    protected $money = 10; // 受保护的
    public function __get($key) {
        if ($key == 'age') {
            return "girl not tell you";
        }
    }
}
// get方法
echo $xw ->age = 18;// girl not tell you
```

### __isset()：
是测定变量是否设定用的函数，传入一个变量作为参数，如果传入的变量存在则传回true，否则传回false。

```php
class Person{
    public $name = 'xiaowang'; // 公有的
    private $age = '25'; // 私有的
    protected $money = 10; // 受保护的
    // isset方法
	public function __isset($key){
	    if($key == "age"){
	        return true;
	    }
	}
	
	// var_dump 打印输出
}
// isset方法
var_dump(isset($xw -> age));        //false
```

### __unset()：
是对不可访问或不存在的属性进行unset时被调用。
把对象中的属性销毁
```php
class Person{
    public $name = 'xiaowang'; // 公有的
    private $age = '25'; // 私有的
    protected $money = 10; // 受保护的
    // unset方法
	public function __unset($key){
	    if($key == "age") {
	        unset($this -> age);
	    }
	}
}
// unset方法
unset($xw -> age);
```

