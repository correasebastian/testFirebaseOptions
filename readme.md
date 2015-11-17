to run 

npm install


bower install

ionic state reset

----

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