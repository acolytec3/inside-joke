(this.webpackJsonpjoker=this.webpackJsonpjoker||[]).push([[0],{185:function(e,t){},246:function(e,t){},443:function(e,t,n){},521:function(e,t){},522:function(e,t){},554:function(e,t){},564:function(e,t){},688:function(e,t){},813:function(e,t){},815:function(e,t){},845:function(e,t){},860:function(e,t){},862:function(e,t){},892:function(e,t){},893:function(e,t){},952:function(e,t,n){"use strict";n.r(t);var r,a=n(9),c=n(0),s=n.n(c),o=n(77),i=n.n(o),u=(n(443),n(1)),l=n.n(u),p=n(80),b=n(28),d=n(8),f=n(411),j=n.n(f),x=n(412),h=n.n(x),O=n(413),v=n(414),m=n.n(v),y=n(415),g=n.n(y),w=n(27),P=n.n(w),S=n(416),k=n.n(S),C={libp2p:void 0,remotePeer:void 0,remotePeerPubKeyString:"",remotePeerPubKey:void 0},K=Object(c.createContext)({state:C,dispatch:function(){return null}}),E=n(977),I=function(e,t){switch(console.log("Current state is:"),console.log(e),console.log("Action requested is:"),console.log(t),t.type){case"LOAD_NODE":return Object(p.a)(Object(p.a)({},e),{},{libp2p:t.payload});case"SET_PEER":return console.log("action is",t),Object(p.a)(Object(p.a)({},e),{},{remotePeer:t.payload.remotePeer,remotePeerPubKey:t.payload.remotePeerPubKey,remotePeerPubKeyString:t.payload.remotePeerPubKeyString});default:return e}},T=n(962),D=n(963),R=n(974),A=n(965),F=n(79),L=n(418),N=n.n(L),J=function(){var e=s.a.useState(!0),t=Object(d.a)(e,2),n=t[0],r=t[1],c=s.a.useState(""),o=Object(d.a)(c,2),i=o[0],u=o[1],l=s.a.useContext(K).state,p=Object(T.a)(i).onCopy;return s.a.useEffect((function(){var e,t=!0;return console.log(l.libp2p),(null===(e=l.libp2p)||void 0===e?void 0:e.peerId)&&t&&(u(l.libp2p.peerId.toJSON().privKey),r(!1)),function(){t=!1}}),[l.libp2p]),Object(a.jsxs)(D.a,{d:"flex",alignItems:"baseline",children:[Object(a.jsx)(R.a,{isLoaded:!n&&""!==i,children:Object(a.jsx)(F.a,{identifier:i})}),Object(a.jsx)(R.a,{isLoaded:!n&&""!==i,children:Object(a.jsxs)(D.a,{align:"center",marginY:5,children:[Object(a.jsx)(N.a,{value:i||"",size:400}),Object(a.jsx)(A.a,{mt:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",w:"200px",cursor:"pointer",onClick:p,children:l.libp2p&&l.libp2p.peerId.toJSON().pubKey})]})})]})},B=n(973),z=n(967),_=n(426),Q=n(972),M=n(969),Y=n(978),q=n(170),H=n.n(q),U=n(424),W=function(e){var t=e.chatOff,n=s.a.useContext(K),r=n.state,c=n.dispatch,o=s.a.useState(!1),i=Object(d.a)(o,2),u=i[0],p=i[1],f=s.a.useState(""),j=Object(d.a)(f,2),x=j[0],h=j[1],O=s.a.useState(!1),v=Object(d.a)(O,2),m=v[0],y=v[1],g=Object(B.a)(),w=function(){var e=Object(b.a)(l.a.mark((function e(){var n,a,s,o,i;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!x){e.next=40;break}return p(!0),e.prev=2,e.next=5,P.a.createFromPrivKey(x);case 5:return n=e.sent,console.log(n),e.next=9,H.a.keys.unmarshalPrivateKey(n.marshalPrivKey());case 9:a=e.sent,console.log(a),e.next=20;break;case 13:return e.prev=13,e.t0=e.catch(2),console.log("Error!",e.t0),g({title:"Invalid address",description:"Scan your friend's QR code and try again",status:"error",duration:3e3,isClosable:!0,position:"top"}),h(""),p(!1),e.abrupt("return");case 20:s=Date.now(),o=!1;case 22:return e.prev=22,e.t1=console,e.next=26,null===(i=r.libp2p)||void 0===i?void 0:i.ping(n);case 26:e.t2=e.sent,e.t1.log.call(e.t1,"ping ",e.t2),o=!0,e.next=36;break;case 31:return e.prev=31,e.t3=e.catch(22),e.next=35,new Promise((function(e){return setTimeout(e,2e3)}));case 35:console.log("Error!",e.t3);case 36:if(Date.now()-s<5e3&&!o){e.next=22;break}case 37:o?(c({type:"SET_PEER",payload:{remotePeer:n,remotePeerPubKey:a,remotePeerPubKeyString:x}}),t()):g({title:"Couldn't find friend!",description:"Scan your friend's QR code and try again",status:"error",duration:3e3,isClosable:!0,position:"top"}),h(""),p(!1);case 40:case"end":return e.stop()}}),e,null,[[2,13],[22,31]])})));return function(){return e.apply(this,arguments)}}();return Object(a.jsxs)(D.a,{d:"flex",alignItems:"baseline",children:[Object(a.jsx)(R.a,{isLoaded:""!==x,children:Object(a.jsx)(F.a,{identifier:x})}),Object(a.jsxs)(D.a,{align:"center",children:[Object(a.jsx)(z.a,{height:"200px",width:"200px",value:x,placeholder:"Peer's Public Key",type:"password",onChange:function(e){return h(e.target.value)}}),Object(a.jsxs)(E.a,{children:[Object(a.jsx)(_.a,{onClick:w,children:"Find a friend"}),Object(a.jsx)(_.a,{onClick:function(){return y(!0)},children:"Read QR Code"})]})]}),Object(a.jsx)(Q.a,{isCentered:!0,closeOnEsc:!1,isOpen:u,onClose:function(){},children:Object(a.jsx)(Q.d,{children:Object(a.jsx)(Q.c,{children:Object(a.jsx)(Q.b,{children:Object(a.jsxs)(M.a,{h:"50px",children:[Object(a.jsx)(Y.a,{mr:"10px"}),Object(a.jsx)(A.a,{children:"Phoning a friend"})]})})})})}),Object(a.jsx)(Q.a,{isOpen:m,onClose:function(){return y(!1)},children:Object(a.jsx)(Q.d,{children:Object(a.jsx)(Q.c,{children:Object(a.jsx)(Q.b,{children:Object(a.jsx)(U.a,{delay:300,onError:function(e){return console.log(e)},onScan:function(e){h(e),e&&y(!1)},style:{width:"100%"}})})})})})]})},G=n(53),V=n(970),X=n(971),Z=n(423),$=n(49),ee=n(57),te=function(){var e=Object(b.a)(l.a.mark((function e(t,n){var r,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,H.a.keys.unmarshalPrivateKey(n.peerId.marshalPrivKey());case 2:return r=e.sent,a="",e.next=6,Object(ee.pipe)(t.source,function(){var e=Object(b.a)(l.a.mark((function e(t){var n,c,s,o,i,u,p,b;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n="",c=!0,s=!1,e.prev=3,i=Object($.a)(t);case 5:return e.next=7,i.next();case 7:return u=e.sent,c=u.done,e.next=11,u.value;case 11:if(p=e.sent,c){e.next=18;break}n+=p.toString("utf8");case 15:c=!0,e.next=5;break;case 18:e.next=24;break;case 20:e.prev=20,e.t0=e.catch(3),s=!0,o=e.t0;case 24:if(e.prev=24,e.prev=25,c||null==i.return){e.next=29;break}return e.next=29,i.return();case 29:if(e.prev=29,!s){e.next=32;break}throw o;case 32:return e.finish(29);case 33:return e.finish(24);case 34:b=new Uint8Array(n.match(/.{1,2}/g).map((function(e){return parseInt(e,16)}))),a=(new TextDecoder).decode(r.decrypt(b));case 36:case"end":return e.stop()}}),e,null,[[3,20,24,34],[25,,29,33]])})));return function(t){return e.apply(this,arguments)}}());case 6:return e.abrupt("return",a);case 7:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),ne=function(){var e=Object(b.a)(l.a.mark((function e(t,n,r,a){var c,s,o,i,u;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=18;break}return e.next=3,n.peerStore.get(r);case 3:if(c=e.sent,s=a.encrypt((new TextEncoder).encode(t)),o=s.reduce((function(e,t){return e+t.toString(16).padStart(2,"0")}),""),!(c&&c.addresses.length>0&&t&&n)){e.next=18;break}return e.prev=7,e.next=10,n.dialProtocol(r,["/encryptedChat/1.0"]);case 10:i=e.sent,u=i.stream,Object(ee.pipe)(o,u),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(7),console.log(e.t0);case 18:case"end":return e.stop()}}),e,null,[[7,15]])})));return function(t,n,r,a){return e.apply(this,arguments)}}(),re="#1512BA",ae="#1512AB",ce=function(e){var t,n=e.chatOn,r=e.chatOff,c=s.a.useContext(K).state,o=s.a.useState(),i=Object(d.a)(o,2),u=i[0],p=i[1],f=s.a.useState([]),j=Object(d.a)(f,2),x=j[0],h=j[1],O=s.a.useState(!1),v=Object(d.a)(O,2),m=v[0],y=v[1],g=s.a.useState(!1),w=Object(d.a)(g,2),P=w[0],S=w[1],k=Object(B.a)();s.a.useEffect((function(){c.libp2p.handle("/encryptedChat/1.0",function(){var e=Object(b.a)(l.a.mark((function e(t){var n,r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.stream,e.next=3,te(n,c.libp2p);case 3:(r=e.sent)===re?y(!0):(r===ae||h((function(e){return[].concat(Object(G.a)(e),[{from:"them",message:r}])})),y(!1));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())})),s.a.useEffect((function(){var e=function(){var t=Object(b.a)(l.a.mark((function t(){return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.t0=console,t.next=4,c.libp2p.ping(c.remotePeer);case 4:t.t1=t.sent,t.t0.log.call(t.t0,"is anybody out there?",t.t1),setTimeout((function(){return e()}),5e3),t.next=16;break;case 9:t.prev=9,t.t2=t.catch(0),console.log("Error!",t.t2),k({title:"Connection lost!",description:"Your friend seems to have disconnected.",status:"error",duration:3e3,isClosable:!0,position:"top"}),r(),p(""),h([]);case 16:case"end":return t.stop()}}),t,null,[[0,9]])})));return function(){return t.apply(this,arguments)}}();n&&setTimeout((function(){return e()}),5e3)}),[n]);var C=function(){var e=Object(b.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ne(u,c.libp2p,c.remotePeer,c.remotePeerPubKey),h((function(e){return[].concat(Object(G.a)(e),[{from:"me",message:u}])})),p(""),S(!1);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),I=function(){var e=Object(b.a)(l.a.mark((function e(t){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:p(t.target.value),""===t.target.value||P||(ne(re,c.libp2p,c.remotePeer,c.remotePeerPubKey),S(!0)),""===t.target.value&&P&&(ne(ae,c.libp2p,c.remotePeer,c.remotePeerPubKey),S(!1));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(a.jsxs)(D.a,{children:[Object(a.jsxs)(D.a,{position:"absolute",height:"100%",w:"100vw",left:"0px",children:[x.length>0&&x.map((function(e){var t;return Object(a.jsxs)(E.a,{children:[Object(a.jsx)(F.a,{identifier:"me"===e.from?null===(t=c.libp2p)||void 0===t?void 0:t.peerId.toJSON().pubKey:c.remotePeerPubKeyString,size:48}),Object(a.jsx)(A.a,{children:e.message})]},e.message)})),m&&Object(a.jsxs)(E.a,{children:[Object(a.jsx)(F.a,{identifier:c.remotePeerPubKeyString,size:48}),Object(a.jsx)(R.a,{children:Object(a.jsx)(A.a,{children:"Some very long message that you'll never see!!! Hello!"})})]})]}),Object(a.jsxs)(E.a,{justifyContent:"center",spacing:3,position:"fixed",bottom:"0px",left:"0px",w:"100vw",children:[Object(a.jsx)(F.a,{identifier:null===(t=c.libp2p)||void 0===t?void 0:t.peerId.toJSON().pubKey,size:48}),Object(a.jsx)(V.a,{opacity:"100%",bg:"white",placeholder:"Say something",maxWidth:"300px",value:u,onChange:function(e){return I(e)},onKeyPress:function(e){return"Enter"===e.key&&C()}}),Object(a.jsx)(X.a,{"aria-label":"send message",isDisabled:""===u||!c.remotePeer,onClick:C,icon:Object(a.jsx)(Z.a,{})})]})]})},se={modules:{transport:[h.a,k.a],connEncryption:[O.NOISE],streamMuxer:[g.a],pubsub:m.a},addresses:{listen:["/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star","/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star"]},config:{pubsub:{enabled:!0}}};function oe(){var e=s.a.useReducer(I,C),t=Object(d.a)(e,2),n=t[0],c=t[1],o=s.a.useState(!1),i=Object(d.a)(o,2),u=i[0],f=i[1];s.a.useEffect((function(){x()}),[]);var x=function(){var e=Object(b.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P.a.create({bits:1024,keyType:"RSA"});case 2:if(t=e.sent,n=Object(p.a)(Object(p.a)({},se),{},{peerId:t}),!r||!r.isStarted){e.next=7;break}return e.next=7,r.stop();case 7:return e.next=9,j.a.create(n);case 9:return r=e.sent,c({type:"LOAD_NODE",payload:r}),e.next=13,r.start();case 13:console.log("listening on: "+r.peerId.toB58String());case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(a.jsx)(K.Provider,{value:{dispatch:c,state:n},children:Object(a.jsxs)(E.b,{align:"center",w:"100vw",children:[!u&&Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(J,{}),Object(a.jsx)(W,{chatOff:function(){return f(!0)}})]}),u&&Object(a.jsx)(ce,{chatOn:u,chatOff:function(){return f(!1)}})]})})}var ie=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,979)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,s=t.getTTFB;n(e),r(e),a(e),c(e),s(e)}))},ue=n(975);i.a.render(Object(a.jsx)(s.a.StrictMode,{children:Object(a.jsx)(ue.a,{children:Object(a.jsx)(oe,{})})}),document.getElementById("root")),ie()}},[[952,1,2]]]);
//# sourceMappingURL=main.5b6c42f4.chunk.js.map