// 事件监听装置
class EventEmiter{
        constructor(  ){
                this.events = {  }
        }
        // 事件监听
        on( event, callback ){
                if( typeof( this.events[ event ] === "undefined" ) ){
                        this.events[ event ] = [  ]
                }
                this.events[ event ].push( callback )
                console.log( "监听事件" + event )
        }
        // 事件触发
        emit( event, args ){
                console.log( "触发事件" + event )
                for( let key in this.events ){
                        if( key === event ){
                                for( let i = 0; i < this.events[ key ].length; i ++ ){
                                        this.events[ key ][ i ]( args )
                                }

                        }
                }
        }
}

// 动态数据绑定
class Observer{
        constructor( data ){
                this.data = data
                this.key_value = null
                this.event_emit = new EventEmiter(  )
                // 监听 data 对象每一个属性的值
                this.traverse( data )
        }
        // 获取对象指定属性值
        receive_value( obj, name ){
                for( let key in obj ){
                        if( key === name ){
                                this.key_value = obj[ key ]
                                break
                        } else {
                                if( typeof( obj[ key ] ) === "object" ){
                                        this.receive_value( obj[ key ], name )
                                }
                        }
                }
        }
        // 遍历属性添加 监听/事件绑定
        traverse( obj ){
                let value
                for( let key in obj ){
                        if( obj.hasOwnProperty( key ) ){
                                value = obj[ key ]
                                if( typeof( value ) === "object" ){
                                        this.traverse( value )
                                }
                                this.data_observer( obj, key, value )
                        }
                } 
        }
        // 数据观测
        data_observer( obj, key, value ){
                let val = value
                let _this = this
                Object.defineProperty(obj, key, {
                        enumerable : true,
                        configurable : true,
                        get : function(  ){
                                console.log( "你访问了" + key )
                                return val
                        },
                        set : function( new_value ){
                                console.log( "你设置了" + key + ",新值为：" + new_value )
                                if( val === new_value ){ return }
                                if( typeof( new_value ) === "object" ){
                                        _this.traverse( new_value )
                                }
                                val = new_value
                                // 触发监听事件
                                for( let event in _this.event_emit.events ){
                                        if( event === key ){
                                                _this.event_emit.emit( key, new_value )
                                        }
                                }
                        }
                })
        }
        // 事件绑定
        $watch( property, callback ){
                // 获取 property 的值，并存放在 this.key_value 中
                this.receive_value( this.data, property )
                let key_value = this.key_value
                if( typeof( key_value ) === "object" ){
                        // 为所有子属性绑定相同事件
                        for( let k in key_value ){
                                this.event_emit.on( k, callback )
                        }
                }
                this.event_emit.on( property, callback )
        }
}

let app = new Observer({
        user : {
                name : "kelly",
                age : "21"
        }
})
app.data.user.name = {
        last_name : "lin",
        first_name : "zepeng",
}
app.data.user.name.first_name
app.$watch("name", function( new_name ){
        console.log( "我的姓名发生变化啦，可能是姓氏发生变化，也可能是名字发生变化" )
})
app.data.user.name.first_name = "L"