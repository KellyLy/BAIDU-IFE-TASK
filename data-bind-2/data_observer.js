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

class Observer{
        constructor( data ){
                this.data = data
                this.event_emit = new EventEmiter(  )
                this.traverse( data )
        }
        // 属性遍历
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
                let _this = this
                Object.defineProperty(obj, key, {
                        enumerable : true,
                        configurable : true,
                        get : function(  ){
                                console.log( "你访问了" + key )
                                return value
                        },
                        set : function( new_value ){
                                console.log( "你设置了" + key + ",新值为：" + new_value )
                                if( value === new_value ){ return }
                                if( typeof( new_value ) === "object" ){
                                        _this.traverse( new_value )
                                }
                                value = new_value
                                for( let event in _this.event_emit.events ){
                                        if( event === key ){
                                                _this.event_emit.emit( key, new_value )
                                        }
                                }
                        }
                })
        }
        // 数据监听
        $watch( property, callback ){
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
app.$watch("first_name", function( first_name ){
        console.log( "我的名字变啦，现在是" + first_name )
})
app.data.user.name.first_name = "L"