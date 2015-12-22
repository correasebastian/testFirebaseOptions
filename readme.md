to run 

npm install


bower install

ionic state reset

ionic io init 

----
fbA.$add({
            Name: 'diez'
        });
        var sss = setInterval(function() {
            console.log(fbA.length);
        }, 1);

        setTimeout(function() {
            clearInterval(sss);
        }, 10);


https://groups.google.com/forum/#!searchin/firebase-angular/$24firebaseArray/firebase-angular/kkWs1FQPjkM/8UQMGmdYgpUJ


http://stackoverflow.com/questions/29708726/get-firebasearray-from-geoquery

-------------------

añadiendo algunos usuarios a grupos
f=new Firebase("https://scmtest.firebaseio.com/")
U {k: Yh, path: L, n: ae, lc: false}
g=f.child("groups").child("-K3LkUDlu_O-QV_VsluO")
U {k: Yh, path: L, n: ae, lc: false}
g.update({users:["d94166fc-f71f-4327-b431-03949c9a27f5"]})

añadiedno grupos a un usuario
f=new Firebase("https://scmtest.firebaseio.com/users/d94166fc-f71f-4327-b431-03949c9a27f5")
U {k: Yh, path: L, n: ae, lc: false}
f.update({groups:["-K3LkUDlu_O-QV_VsluO"]})





 f= new Firebase("https://scmtest.firebaseio.com/groups")
U {k: Yh, path: L, n: ae, lc: false}
f.push().set({name:"bolivar"})
undefined
g=f.child("-K3PvanQDMkwHzp25k9b")
U {k: Yh, path: L, n: ae, lc: false}
g.update({users: {d94166fc-f71f-4327-b431-03949c9a27f5:true}})
VM1490:2 Uncaught SyntaxError: Unexpected token -(…)InjectedScript._evaluateOn @ VM1319:875InjectedScript._evaluateAndWrap @ VM1319:808InjectedScript.evaluate @ VM1319:664
g.update({users: {"d94166fc-f71f-4327-b431-03949c9a27f5":true}})

----------------------directiva para select with search option autocomplete

http://jsfiddle.net/cristoferdomingues/KR7KV/10/




-------------acerca de las fechas

para obtener unix en segundos from moment

moment().unix() // en segundos


para tener una fecha con un dato unix

moment.unix(unixsegundos)

moment(unixMiliSegundos) // este se usa con firebase por que  asi lo da el servidor


-----contar el numero de children y un select solo con los unread


f= new Firebase("https://scmtest.firebaseio.com/users/d94166fc-f71f-4327-b431-03949c9a27f5/notificaciones").orderByChild("unread").equalTo(true)

var z; function c (snap){z=snap}

z.numChildren()

-----agregar una notificacion

f= new Firebase("https://scmtest.firebaseio.com/users/d94166fc-f71f-4327-b431-03949c9a27f5/notificaciones")

f.push().set({placa:"cinco", unread:true, time:t})
