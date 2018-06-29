## simple-wxmp-vueify


### 介绍

既有项目无法重构，但想在某些页面的JS中使用vue的语法？不想手动调用小程序内的setData()？这个库可能帮你解决一些问题

### 特性

- 支持在代码中使用this.xxx表示data属性
- 支持计算属性
- 支持响应式更新视图，不用手动setData
### 使用Demo


```bash
$ git clone https://github.com/qk44077907/simple-wxmp-vueify.git
```
之后文件夹拷贝至项目根目录
```javascript
//你的路径
import '/simple-wxmp-vueify/index.js'

Page({
    reactive: true,//在初始化页面时传入此字段，库将自动把页面转化为响应式
    data: {
        questionName: '',
        questionDesc: '',
        questionList: [
            {
                content: '',
            },
            {
                content: '',
            },
        ],
        questionTypeList: ['单选', '多选'],
        questionTypeIndex: 0,
    },
    computed: {
        questionType: function () {
            return this.questionTypeList[this.questionTypeIndex]
        }
    },
    addItem() {
        this.questionList.push({
            content: '',
        })
    },
    removeItem(e) {
        let index = e.target.dataset.index
        if (this.questionList.length <= 2) {
            return
        }
        this.questionList.splice(index, 1)
    }
});

```

wxml模板
```html
<view class="question-panel">
    <view
            class="item"
            wx:for="{{questionList}}"
            wx:for-item="question"
            wx:for-index="index"
            wx:key="name"
    >
        <!--
        注意双向绑定更新需要在对应元素上指定data-path属性
        代表需要更新的属性相对data的路径，使用 '.'拼接
        如 'questionList.0.content'


        -->
        <textarea
                            bindinput="updateVM" data-path="questionList.{{index}}.content"
                            type="text" placeholder="{{'选项'+(index+1)}}"
                            placeholder-style="font-size:30rpx"
                            maxlength="40"
                            value="{{question.content}}"
                            auto-height
        >
        </textarea>
        <view
            class="icon"
            bindtap="removeItem"
            data-index="{{index}}"
        >
            删除
        </view>
        <view
            class="icon"
            bindtap="addItem"
            data-index="{{index}}"
        >
            添加
        </view>
    </view>
</view>
```

