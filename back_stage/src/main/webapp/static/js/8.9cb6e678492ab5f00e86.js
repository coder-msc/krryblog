webpackJsonp([8],{"71LQ":function(t,e,o){(t.exports=o("UTlt")(!0)).push([t.i,"","",{version:3,sources:[],names:[],mappings:"",file:"index.vue",sourceRoot:""}])},"K+fn":function(t,e,o){var n=o("71LQ");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);o("FIqI")("7fe65ed4",n,!0,{})},wAeH:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o("lC5x"),a=o.n(n),r=o("J0Oq"),s=o.n(r),i=o("teIl"),u=o("TVmP"),c=o("JycG"),l=o("wHgX"),d=o("YcJa"),f=o("0jG4"),p={data:function(){return{blog:{},status:200,description:"About me"}},computed:{isNoBlog:function(){return 404===this.status}},created:function(){this.getAbout()},methods:{getAbout:function(){var t=this;return s()(a.a.mark(function e(){var o,n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return o={title:"关于我"},e.next=3,f.a.getLinkOrAbout(o);case 3:n=e.sent,t.status=n.status,404!==t.status&&(t.blog=n.data,document.title=t.blog.title+" - "+document.title);case 6:case"end":return e.stop()}},e,t)}))()}},components:{Header:i.a,Footer:u.a,NotFound:d.default,SectionHeader:c.a,Detail:l.a}},g={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return t.isNoBlog?o("NotFound"):o("main",[o("Header"),t._v(" "),o("SectionHeader",{attrs:{title:t.blog.title,description:t.description}}),t._v(" "),o("Detail",{attrs:{blog:t.blog,isNoBlog:t.isNoBlog}}),t._v(" "),o("Footer")],1)},staticRenderFns:[]};var v=o("C7Lr")(p,g,!1,function(t){o("K+fn")},"data-v-90741ba0",null);e.default=v.exports}});
//# sourceMappingURL=8.9cb6e678492ab5f00e86.js.map