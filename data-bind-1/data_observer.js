class Observer{
        constructor( data ){
                this.data = data
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
                                this.watch( key, value )
                        }
                } 
        }
        // 属性监听
        watch( key, value ){
                Object.defineProperty(this.data, key, {
                        enumerable : true,
                        configurable : true,
                        get : function(  ){
                                console.log( "你访问了" + key )
                                return value
                        },
                        set : function( new_value ){
                                console.log( "你设置了" + key + ",新值为：" + new_value )
                                if( value === new_value ){ return }
                                value = new_value
                        }
                })
        }
}

let app = new Observer({
        user : {
                name : "kelly",
                age : "21"
        }
})
console.log( app.data )
app.data.user
app.data.name = "lin"