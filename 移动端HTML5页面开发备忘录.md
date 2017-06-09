# 移动端HTML5页面开发备忘录

## 几个概念

#### css像素
- html中度量的单位 用px来计算，在pc中往往 1 css px ＝ 1 物理像素
- css像素时抽象和相对的了，在不同设备中1px对应不同的设备像素；iphone3分辨率是320*480 即 css 1px ＝ 1个物理像素；iphone4 分辨率640x960但屏幕尺寸没有改变，意味着同一块区域像素多了1倍 即 css 1px ＝2个物理像素；

#### 物理像素
- 表示每英寸所拥有的像素数目，数值越高，代表屏幕能够以更高的密度来显示图像

#### 物理像素
- 显示器所能显示的像素多少，显示器可以显示的像素越多，画面就越精细，同样的屏幕区域能显示的信息就越多

#### devicePixelRatio(dpi)
- window.devicePixelRadio = 物理像素/css像素 在iphone4中devicePixelRatio＝2 也就是1css像素＝2个物理像素
- devicePixelRatio在不同浏览器中存在一些兼容性问题，并不是完全可靠的

#### layout viewport
- 移动设备的默认viewport,css布局是以layout viewport 来做为参考系计算的
- document.documenElement.clientWidth 获取
- 该尺寸时动态设置

#### visual viewport
- 代表浏览器窗口的尺寸，当用户放大浏览器时这个尺寸就会变小
- window.innerWidth 获取

#### ideal viewport
- 屏幕尺寸 设备屏幕的尺寸 单位是物理像素
- screen.width 获取 屏幕尺寸是不变的
- 在该viewport中用户不需要缩放和横向滚动就可以正常查看网站的所有内容
- 设置移动端网站一般以这个viewport为准,ideal viewport 的宽度等于设备屏幕宽度，使得无论在什么分辨率下，那些针对ideal viewport设计的网站都可以完美的呈现给用户。


## 有关Meta

#### 基本Meta
```html
    <!-- 设置缩放，shrink-to-fit=no可以防止页面在transition时进行自动的收缩，miniual-ui为ios的safari新增的属性，隐藏顶部的地址栏和底部的导航栏-->
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui,shrink-to-fit=no" />
    <!-- 可隐藏地址栏，仅针对IOS的Safari（注：IOS7.0版本以后，safari上已看不到效果） -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <!-- 仅针对IOS的Safari顶端状态条的样式（可选default/black/black-translucent ） -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <!-- IOS中禁用将数字识别为电话号码/忽略Android平台中对邮箱地址的识别 -->
    <meta name="format-detection" content="telephone=no, email=no" />
```

#### 搜索引擎Meta
```html
    <!-- 搜索引擎索引方式：通常有如下几种取值：none，noindex，nofollow，all，index和follow。-->
    <meta name="robots" content="index,follow" />
    <!--
        all：文件将被检索，且页面上的链接可以被查询；
        none：文件将不被检索，且页面上的链接不可以被查询；
        index：文件将被检索；
        follow：页面上的链接可以被查询；
        noindex：文件将不被检索；
        nofollow：页面上的链接不可以被查询。
     -->
```

#### 页面缓存设置Meta
```html
    <!-- 清除缓存 -->
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
```

## 常见问题

#### 移动端字体设置
```css
    /*中英字体名对照表
    宋体      SimSun
    黑体      SimHei
    微信雅黑   Microsoft Yahei
    微软正黑体 Microsoft JhengHei
    新宋体    NSimSun
    新细明体  MingLiU
    细明体    MingLiU
    标楷体    DFKai-SB
    仿宋     FangSong
    楷体     KaiTi
    仿宋_GB2312  FangSong_GB2312
    楷体_GB2312  KaiTi_GB2312  
    说明：中文字体多数使用宋雅黑，英文用Helvetica
    */
    body { font-family: Microsoft Yahei,SimSun,Helvetica; }
```

#### 打电话发短信写邮件
```html
    // 打电话
    <a href="tel:010-88888">打电话给:010-88888</a>

    //  发短信
    <a href="sms:88888">发短信给: 88888</a>

    // 写邮件
    //注：在添加这些功能时，第一个功能以"?"开头，后面的以"&"开头
    //1.普通邮件
    <a href="mailto:haha@wtf.com">快来点我啊，给你发种子。</a>
    //2.收件地址后添加?cc=开头，可添加抄送地址（Android存在兼容问题）
    <a href="mailto:haha@wtf.com?cc=666@wtf.com">快来点我啊，给你发种子。</a>
    //3.跟着抄送地址后，写上&bcc=,可添加密件抄送地址（Android存在兼容问题）
    <a href="mailto:haha@wtf.com?cc=666@wtf.com&bcc=384900096@wtf.com">快来点我啊，给你发种子。</a>
    //4.包含多个收件人、抄送、密件抄送人，用分号(;)隔开多个邮件人的地址
    <a href="mailto:haha@wtf.com;384900096@wtf.com">快来点我啊，给你发种子。</a>
    //5.包含主题，用?subject=
    <a href="mailto:haha@wtf.com?subject=邮件主题">快来点我啊，给你发种子。</a>
    //6.包含内容，用?body=;如内容包含文本，使用%0A给文本换行
    <a href="mailto:haha@wtf.com?body=邮件主题内容%0A我是第二行内容%0A你没有猜错，这是我是第三行。">快来点我啊，给你发种子。</a>
    //7.内容包含链接，含http(s)://等的文本自动转化为链接
    <a href="mailto:haha@wtf.com?body=http://www.wtf.com">快来点我啊，给你发种子。</a>
    //8.内容包含图片（PC不支持）
    <a href="mailto:haha@wtf.com?body=<img src='images/torrent.jpg' />">快来点我啊，给你发种子。</a>
    //9.完整示例
    <a href="mailto:haha@wtf.com;384900096@wtf.com?cc=666@wtf.com&bcc=993233461@wtf.com&subject=[邮件主题]&body=我是第一行内容%0A%0Ahttp://www.baidu.com%0A%0A<img src='images/1.jpg' />">快来点我啊，给你发种子。</a>
```

#### 如何为不定高度(height:auto)的元素添加CSS3 transition-property:height 动画
* 当一个元素不设置height时，它的默认值是 auto，浏览器会计算出实际的高度。
* 但如果想给一个 height:auto 的块级元素的高度添加 CSS3 动画时，该怎么办呢？
* 从 MDN 的可以查到 CSS 支持动画的属性中的 height 属性如下：
height ：yes, as a length, percentage or calc(); // 当 height 的值是 length，百分比或 calc() 时支持 CSS3 过渡。
* 所以当元素 height : auto 时，是不支持 CSS3 动画的。
* 除了通过 JS 获取精确的 height 值的方法外，其实我们可以使用 max-height 代替 height。
* 只要我们设置一个肯定比元素自增长大的高度值就可以了。当然，因为是根据 max-height 值进行过渡效果，所以最好不要大得离谱，否则动画效果不理想。

## touch事件

#### 事件响应顺序：ontouchstart > ontouchmove > ontouchend > onclick
- touchstart ——当手指触碰屏幕时候发生
- touchmove ——当手指在屏幕上滑动时连续触发。
- 通常在滑屏页面，会调用 event 的 preventDefault() 可以阻止默认情况的发生：阻止页面滚动
- touchend ——当手指离开屏幕时触发
- touchcancel ——系统停止跟踪触摸时候会触发。例如在触摸过程中突然页面 alert() ，此时会触发该事件，这个事件比较少用。

#### TouchEvent说明：
- touches：屏幕上所有手指的信息
- targetTouches：手指在目标区域的手指信息
- changedTouches：最近一次触发该事件的手指信息
- touchend时，touches与targetTouches信息会被删除，changedTouches保存的最后一次的信息，用于计算手指信息

#### 参数信息(changedTouches[0])
- clientX、clientY在显示区的坐标
- target：当前元素


## 科普：移动端click事件200-300ms的延时响应
#### 以下是历史原因
2007年苹果发布首款iphone上IOS系统搭载的safari为了将适用于PC端上大屏幕的网页能比较好的展示在手机端上，使用了双击缩放(double tap to zoom)的方案，比如你在手机上用浏览器打开一个PC上的网页，你可能在看到页面内容虽然可以撑满整个屏幕，但是字体、图片都很小看不清，此时可以快速双击屏幕上的某一部分，你就能看清该部分放大后的内容，再次双击后能回到原始状态。

双击缩放是指用手指在屏幕上快速点击两次，iOS自带的Safari浏览器会将网页缩放至原始比例。

原因就出在浏览器需要如何判断快速点击上，当用户在屏幕上单击某一个元素时候，例如跳转链接 <a href="#"></a> ，此处浏览器会先捕获该次单击，但浏览器不能决定用户是单纯要点击链接还是要双击该部分区域进行缩放操作，所以，捕获第一次单击后，浏览器会先Hold一段时间t，如果在t时间区间里用户未进行下一次点击，则浏览器会做单击跳转链接的处理，如果t时间里用户进行了第二次单击操作，则浏览器会禁止跳转，转而进行对该部分区域页面的缩放操作。那么这个时间区间t有多少呢？在IOS safari下，大概为300毫秒。这就是延迟的由来。

造成的后果用户纯粹单击页面，页面需要过一段时间才响应，给用户慢体验感觉，对于web开发者来说是，页面js捕获click事件的回调函数处理，需要300ms后才生效，也就间接导致影响其他业务逻辑的处理。

#### 解决方案：
- fastclick
- zepto的touch模块

## 点击元素产生背景或边框问题
```css
    a,button,input,textarea {
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-user-modify:read-write-plaintext-only; //-webkit-user-modify有个副作用，就是输入法不再能够输入多个字符
    }   
    /*也可以...，简单粗暴*/
    * { -webkit-tap-highlight-color: rgba(0,0,0,0); }
```

## 字体单位font-size选择px还是rem
```css
     /*如需适配多种移动设备，建议使用rem。以下为参考值：*/
    html { font-size: 62.5%; }   /*10÷16 = 62.5%*/
    /*设置12px字体。
    注：在rem前要加上对应的px值，解决不支持rem的浏览器的兼容问题，做到优雅降级*/
    body { font-size:12px; font-size:1.2rem; }
```

## 其它一些实用CSS技巧
```css
    /*禁止长按链接与图片弹出菜单*/
    a,img { -webkit-touch-callout: none }    
    /*禁止ios和android用户选中文字*/
    html,body {-webkit-user-select:none; user-select: none; }
    /*改变输入框placeholder的颜色值*/
    ::-webkit-input-placeholder { /* WebKit browsers */
    color: #999; }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #999; }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #999; }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #999; }
    input:focus::-webkit-input-placeholder{ color:#999; }

    /*android上去掉语音输入按钮*/
    input::-webkit-input-speech-button {display: none}
    /*去掉ios设备上input里的阴影*/
    input { -webkit-appearance:none; } /* Safari 和 Chrome */
```
使用translate3d代替translate可以自动开启GPU加速渲染

## 禁用input在ios下，输入英文首字母的默认大写，页面加载时就自动获取焦点
```html
    <input autocapitalize="off" autocorrect="off" autofocus />
```

## 屏幕旋转的事件和样式

#### JS处理：
```js
    function orientInit(){
        var orientChk = document.documentElement.clientWidth > document.documentElement.clientHeight?'landscape':'portrait';
        if(orientChk =='lapdscape'){
            //横屏下需要执行代码
        }else{
            //竖屏下需要执行代码
        }
    }

    orientInit();
    window.addEventListener('onorientationchange' in window?'orientationchange':'resize', function(){
        setTimeout(orientInit, 100);
    },false)
```

#### CSS处理：
```css
    /*竖屏时样式*/
    @media all and (orientation:portrait){   }
    /*横屏时样式*/
    @media all and (orientation:landscape){   }
```

## 播放视频不全屏
```html
    <!--
    1.ios7+支持自动播放
    2.支持Airplay的设备（如：音箱、Apple TV)播放
    x-webkit-airplay="true"
    3.播放视频不全屏
    webkit-playsinline="true"
    -->
    <video x-webkit-airplay="true" webkit-playsinline="true" preload="auto" autoplay src="http://"></video>
```

## 消除transition闪屏
```css
    .css {
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
    }
```

## rem适配终极解决方案
```js
    function adapt(designWidth, rem2px){
      var d = window.document.createElement('div');
      d.style.width = '1rem';
      d.style.display = "none";
      var head = window.document.getElementsByTagName('head')[0];
      head.appendChild(d);
      var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
      d.remove();
      document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
      var st = document.createElement('style');
      var portrait = "@media screen and (min-width: "+window.innerWidth+"px) {html{font-size:"+ ((window.innerWidth/(designWidth/rem2px)/defaultFontSize)*100) +"%;}}";
      var landscape = "@media screen and (min-width: "+window.innerHeight+"px) {html{font-size:"+ ((window.innerHeight/(designWidth/rem2px)/defaultFontSize)*100) +"%;}}"
      st.innerHTML = portrait + landscape;
      head.appendChild(st);
      return defaultFontSize
    };
    var defaultFontSize = adapt(640, 100);
```
