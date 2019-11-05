# PHP学习(六) PHP面向对象之继承与多态

## 继承性


+ 子类只能继承父类的非私有属性（public、protect）。
+ 子类继承父类后，相当于将父类的属性和方法copy到子类，可以直接使用$this调用该属性;
+ PHP只能单继承，不支持一个类继承多个类。但是一个类可以进行多层继承（即B继承于A，而C又继承于B，C通过B间接继承了A）

```php
class A {

}
class B extends A{

}
```

## 多态性


一个类，被多个子类继承，如果这个类的某个方法，在多个子类中，表现出不同的功能，我们称这种行为为多态。(同一个类的不同子类表现出不同的形态)

**子类中重载父类的方法**
**重载**：父类中定义的方法，子类中有相同的方法名，但是参数个数不同
**重写**：父类中定义的方法，子类中有相同的方法名，参数个数相同

在子类里面允许重写（覆盖）父类中的方法，使用parent访问父类中被覆盖的属性和方法
```php
parent::construct();
parent::fun();
```
## 小实例
```php
<?php
class Person {
    public $name;
    private $age;
    protected $money;
    public function __construct($name,$age , $money){
        $this -> name = $name;
        $this -> age = $age;
        $this -> money = $money;
    }
    public function cardInfo(){
        echo "name-> ".$this->name . "  age->".  $this->age . "   money". $this->money;
    }
}
class YellowPerson extends Person{
    function __construct($name,$age,$money){
        parent::__construct($name,$age,$money);
    }

    public function cardInfo($pp){
        //如果不加parent::cardInfo，就表示重写了父类的方法，再重新调用一下父类的方法。
        //php实现重载的方法
        parent::cardInfo();
        echo $pp;
    }
    public function getMoney(){
        echo $this -> money;
    }
}
$s = new YellowPerson("xiaowang",22,100);
$s -> cardInfo(11);
echo $s -> name; // 公有属性可以继承
// echo $s -> age; // 私有属性无法继承
echo $s -> getMoney(); // 外部不能访问，但是可以继承过来
?>
```

