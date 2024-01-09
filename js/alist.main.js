import{distance}from"https://raw.gitmirror.com/Zhumt1109/test/main/Zhumt1109/test/main/js/mod.js";import{sortListByCN}from"https://raw.gitmirror.com/Zhumt1109/test/main/Zhumt1109/test/main/Zhumt1109/test/main/js/sortName.js";String.prototype.rstrip=function(chars){let regex=new RegExp(chars+"$");return this.replace(regex,"")};var showMode="single";var searchDriver="";var limit_search_show=200;var search_type="";var detail_order="name";var playRaw=1;const request_timeout=5e3;const VERSION="alist v2/v3 20221223";const UA="Mozilla/5.0";function print(any){any=any||"";if(typeof any=="object"&&Object.keys(any).length>0){try{any=JSON.stringify(any);console.log(any)}catch(e){console.log(typeof any+":"+any.length)}}else if(typeof any=="object"&&Object.keys(any).length<1){console.log("null object")}else{console.log(any)}}function getHome(url){if(!url){return""}let tmp=url.split("//");url=tmp[0]+"//"+tmp[1].split("/")[0];try{url=decodeURIComponent(url)}catch(e){}return url}const http=function(url,options={}){if(options.method==="POST"&&options.data){options.body=JSON.stringify(options.data);options.headers=Object.assign({"content-type":"application/json"},options.headers)}options.timeout=request_timeout;if(!options.headers){options.headers={}}let keys=Object.keys(options.headers).map(it=>it.toLowerCase());if(!keys.includes("referer")){options.headers["Referer"]=getHome(url)}if(!keys.includes("user-agent")){options.headers["User-Agent"]=UA}console.log(JSON.stringify(options.headers));try{const res=req(url,options);res.json=()=>res&&res.content?JSON.parse(res.content):null;res.text=()=>res&&res.content?res.content:"";return res}catch(e){return{json(){return null},text(){return""}}}};["get","post"].forEach(method=>{http[method]=function(url,options={}){return http(url,Object.assign(options,{method:method.toUpperCase()}))}});const __drives={};function isMedia(file){return/\.(dff|dsf|mp3|aac|wav|wma|cda|flac|m4a|mid|mka|mp2|mpa|mpc|ape|ofr|ogg|ra|wv|tta|ac3|dts|tak|webm|wmv|mpeg|mov|ram|swf|mp4|avi|rm|rmvb|flv|mpg|mkv|m3u8|ts|3gp|asf)$/.test(file.toLowerCase())}function get_drives_path(tid){const index=tid.indexOf("$");const name=tid.substring(0,index);const path=tid.substring(index+1);return{drives:get_drives(name),path:path}}function get_drives(name){const{settings,api,server,headers}=__drives[name];if(settings.v3==null){settings.v3=false;const data=http.get(server+"/api/public/settings",{headers:headers}).json().data;if(Array.isArray(data)){settings.title=data.find(x=>x.key==="title")?.value;settings.v3=false;settings.version=data.find(x=>x.key==="version")?.value;settings.enableSearch=data.find(x=>x.key==="enable search")?.value==="true"}else{settings.title=data.title;settings.v3=true;settings.version=data.version;settings.enableSearch=false}api.path=settings.v3?"/api/fs/list":"/api/public/path";api.file=settings.v3?"/api/fs/get":"/api/public/path";api.search=settings.v3?"/api/public/search":"/api/public/search"}return __drives[name]}function init(ext){console.log("当前版本号:"+VERSION);let data;if(typeof ext=="object"){data=ext;print("alist ext:object")}else if(typeof ext=="string"){if(ext.startsWith("http")){let alist_data=ext.split(";");let alist_data_url=alist_data[0];limit_search_show=alist_data.length>1?Number(alist_data[1])||limit_search_show:limit_search_show;search_type=alist_data.length>2?alist_data[2]:search_type;print(alist_data_url);data=http.get(alist_data_url).json()}else{print("alist ext:json string");data=JSON.parse(ext)}}let drives=[];if(Array.isArray(data)&&data.length>0&&data[0].hasOwnProperty("server")&&data[0].hasOwnProperty("name")){drives=data}else if(!Array.isArray(data)&&data.hasOwnProperty("drives")&&Array.isArray(data.drives)){drives=data.drives.filter(it=>it.type&&it.type==="alist"||!it.type)}print(drives);searchDriver=(drives.find(x=>x.search)||{}).name||"";if(!searchDriver&&drives.length>0){searchDriver=drives[0].name}print(searchDriver);drives.forEach(item=>{let _path_param=[];if(item.params){_path_param=Object.keys(item.params);_path_param.sort((a,b)=>a.length-b.length)}if(item.password){let pwdObj={password:item.password};if(!item.params){item.params={"/":pwdObj}}else{item.params["/"]=pwdObj}_path_param.unshift("/")}__drives[item.name]={name:item.name,server:item.server.endsWith("/")?item.server.rstrip("/"):item.server,startPage:item.startPage||"/",showAll:item.showAll===true,search:!!item.search,params:item.params||{},_path_param:_path_param,settings:{},api:{},headers:item.headers||{},getParams(path){const key=this._path_param.find(x=>path.startsWith(x));return Object.assign({},this.params[key],{path:path})},getPath(path){const res=http.post(this.server+this.api.path,{data:this.getParams(path),headers:this.headers}).json();try{return this.settings.v3?res.data.content:res.data.files}catch(e){console.log(`getPath发生错误:${e.message}`);console.log(JSON.stringify(res));return[{name:"error",value:JSON.stringify(res)}]}},getFile(path){let raw_url=this.server+"/d"+path;raw_url=encodeURI(raw_url);let data={raw_url:raw_url,raw_url1:raw_url};if(playRaw===1){try{const res=http.post(this.server+this.api.file,{data:this.getParams(path),headers:this.headers}).json();data=this.settings.v3?res.data:res.data.files[0];if(!this.settings.v3){data.raw_url=data.url}data.raw_url1=raw_url;return data}catch(e){return data}}else{return data}},isFolder(data){return data.type===1},isVideo(data){return this.settings.v3?data.type===2||data.type===0||data.type===3:data.type===3||data.type===0||data.type===4},is_subt(data){if(data.type===1){return false}const ext=/\.(srt|ass|scc|stl|ttml)$/;return ext.test(data.name)},getPic(data){let pic=this.settings.v3?data.thumb:data.thumbnail;return pic||(this.isFolder(data)?"http://img1.3png.com/281e284a670865a71d91515866552b5f172b.png":"")},getTime(data,isStandard){isStandard=isStandard||false;try{let tTime=data.updated_at||data.time_str||data.modified||"";let date="";if(tTime){tTime=tTime.split("T");date=tTime[0];if(isStandard){date=date.replace(/-/g,"/")}tTime=tTime[1].split(/Z|\https://raw.gitmirror.com/Zhumt1109/test/main/Zhumt1109/test/main/js/);date+=" "+tTime[0]}return date}catch(e){return""}}}});print("init执行完毕")}function home(filter){let classes=Object.keys(__drives).map(key=>({type_id:`${key}$${__drives[key].startPage}`,type_name:key,type_flag:"1"}));let filter_dict={};let filters=[{key:"order",name:"排序",value:[{n:"名称⬆️",v:"vod_name_asc"},{n:"名称⬇️",v:"vod_name_desc"},{n:"中英⬆️",v:"vod_cn_asc"},{n:"中英⬇️",v:"vod_cn_desc"},{n:"时间⬆️",v:"vod_time_asc"},{n:"时间⬇️",v:"vod_time_desc"},{n:"大小⬆️",v:"vod_size_asc"},{n:"大小⬇️",v:"vod_size_desc"},{n:"无",v:"none"}]},{key:"show",name:"播放展示",value:[{n:"单集",v:"single"},{n:"全集",v:"all"}]}];classes.forEach(it=>{filter_dict[it.type_id]=filters});print("----home----");print(classes);return JSON.stringify({class:classes,filters:filter_dict})}function homeVod(params){let _post_data={pageNum:0,pageSize:100};let _post_url="https://pbaccess.video.qq.com/trpc.videosearch.hot_rank.HotRankServantHttp/HotRankHttp";let data=http.post(_post_url,{data:_post_data}).json();let _list=[];try{data=data["data"]["navItemList"][0]["hotRankResult"]["rankItemList"];data.forEach(it=>{_list.push({vod_name:it.title,vod_id:"msearch:"+it.title,vod_pic:"https://avatars.githubusercontent.com/u/97389433?s=120&v=4",vod_remarks:it.changeOrder})})}catch(e){print("Alist获取首页推荐发送错误:"+e.message)}return JSON.stringify({list:_list})}function category(tid,pg,filter,extend){let orid=tid.replace(/#all#|#search#/g,"");let{drives,path}=get_drives_path(orid);const id=orid.endsWith("/")?orid:orid+"/";const list=drives.getPath(path);let subList=[];let vodFiles=[];let allList=[];let fl=filter?extend:{};if(fl.show){showMode=fl.show}list.forEach(item=>{if(item.name!=="error"){if(drives.is_subt(item)){subList.push(item.name)}if(!drives.showAll&&!drives.isFolder(item)&&!drives.isVideo(item)){return}let vod_time=drives.getTime(item);let vod_size=get_size(item.size);let remark=vod_time.split(" ")[0].substr(3)+"\t"+vod_size;let vod_id=id+item.name+(drives.isFolder(item)?"/":"");if(showMode==="all"){vod_id+="#all#"}print(vod_id);const vod={vod_id:vod_id,vod_name:item.name.replaceAll("$","").replaceAll("#",""),vod_pic:drives.getPic(item),vod_time:vod_time,vod_size:item.size,vod_tag:drives.isFolder(item)?"folder":"file",vod_remarks:drives.isFolder(item)?remark+" 文件夹":remark};if(drives.isVideo(item)){vodFiles.push(vod)}allList.push(vod)}else{console.log(item);const vod={vod_name:item.value,vod_id:"no_data",vod_remarks:"不要点,会崩的",vod_pic:"https://ghproxy.net/https://raw.githubusercontent.com/hjdhnx/dr_py/main/404.jpg"};allList.push(vod)}});if(vodFiles.length===1&&subList.length>0){let sub;if(subList.length===1){sub=subList[0]}else{let subs=JSON.parse(JSON.stringify(subList));subs.sort((a,b)=>{let a_similar=(a.includes("chs")?100:0)+levenshteinDistance(a,vodFiles[0].vod_name);let b_similar=(b.includes("chs")?100:0)+levenshteinDistance(b,vodFiles[0].vod_name);if(a_similar>b_similar){return 1}else{return-1}});sub=subs.slice(-1)[0]}vodFiles[0].vod_id+="@@@"+sub;vodFiles[0].vod_remarks+="🏷️"}else{vodFiles.forEach(item=>{const lh=0;let sub;subList.forEach(s=>{const l=levenshteinDistance(s,item.vod_name);if(l>60&&l>lh){sub=s}});if(sub){item.vod_id+="@@@"+sub;item.vod_remarks+="🏷️"}})}if(fl.order){let key=fl.order.split("_").slice(0,-1).join("_");let order=fl.order.split("_").slice(-1)[0];print(`排序key:${key},排序order:${order}`);if(key.includes("name")){detail_order="name";allList=sortListByName(allList,key,order)}else if(key.includes("cn")){detail_order="cn";allList=sortListByCN(allList,"vod_name",order)}else if(key.includes("time")){detail_order="time";allList=sortListByTime(allList,key,order)}else if(key.includes("size")){detail_order="size";allList=sortListBySize(allList,key,order)}else if(fl.order.includes("none")){detail_order="none";print("不排序")}}else{if(detail_order!=="none"){allList=sortListByName(allList,"vod_name","asc")}}print("----category----"+`tid:${tid},detail_order:${detail_order},showMode:${showMode}`);return JSON.stringify({page:1,pagecount:1,limit:allList.length,total:allList.length,list:allList})}function getAll(otid,tid,drives,path){try{const content=category(tid,null,false,null);const isFile=isMedia(otid.repla