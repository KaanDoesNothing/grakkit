!function(){"use strict";const global=globalThis,server=org.bukkit.Bukkit.server,plugin=server.pluginManager.getPlugin("grakkit"),core={async:{clear:task=>task.cancel(),immediate:script=>server.scheduler.runTask(plugin,core.async.wrap(()=>core.async.execute(script))),interval:(script,delay,interval)=>server.scheduler.runTaskTimer(plugin,core.async.wrap(()=>core.async.execute(script)),Math.round(delay/50),Math.round((interval||delay)/50)),execute:script=>server.scheduler.runTaskAsynchronously(plugin,core.async.wrap(script)),timeout:(script,delay)=>server.scheduler.runTaskLater(plugin,core.async.wrap(()=>core.async.execute(script)),Math.floor(delay/50)),wrap:script=>new java.lang.Runnable({run:()=>script()})},circular:function Circular(){},clear:folder=>{const files=folder.listFiles();if(files)for(let index=0;index<files.length;++index){const file=files[index];file.directory?core.clear(file):file.delete()}folder.delete()},color:text=>text.split("&").join("§").split("§§").join("&"),command:options=>{const name=options.name,input=Object.assign({prefix:"grakkit",usage:`/${name} <...args>`,description:"A Minecraft command",execute:()=>{},tabComplete:()=>[]},options);core.commands[name]={execute:input.execute,tabComplete:input.tabComplete};const prefix=`(player,args)=>core.commands[${JSON.stringify(name)}]`,suffix="(player,...args.split(' '))",status=plugin.register(input.prefix,input.name,input.usage,input.description,`${prefix}.execute${suffix}`,`${prefix}.tabComplete${suffix}`);return status?name:`${prefix}:${name}`},commands:{},data:(namespace,key)=>{const store=core.store({data:{},[namespace]:{}}),file=core.folder(core.root,"data",namespace).file(`${key}.json`);return store[key]||(store[key]=JSON.parse(file.read()||"{}"))},display:object=>{if(object&&object.constructor===core.circular)return"Circular";{const type=toString.apply(object);switch(type){case"[object Object]":case"[object Function]":case"[foreign HostFunction]":return type.split(" ")[1].slice(0,-1);case"[object Array]":return`[ ${core.serialize(object).map(core.display).join(", ")} ]`;case"[foreign HostObject]":const output=`${object}`;return!output||output.startsWith("class ")?object.canonicalName||object.class.canonicalName:output;default:switch(typeof object){case"function":return"Function";case"string":return`"${object}"`;case"symbol":return`@@${object.toString().slice(7,-1)}`;default:return`${object}`}}}},ensure:path=>{if(path.make)return path.make(),path;core.traverse([],path,{mode:"array",post:context=>{const file=core.stat(...context).file();file.exists()||file.mkdir()}})},eval:(µ,self)=>eval(µ),event:(name,listener)=>{const store=core.store({event:{},[name]:[]});1===store.push(listener)&&server.pluginManager.registerEvent(core.eval(name).class,new(Java.extend(org.bukkit.event.Listener,{})),org.bukkit.event.EventPriority.HIGHEST,(info,data)=>store.forEach(listener=>listener(data)),plugin)},fetch:location=>new Promise((resolve,reject)=>{core.async.immediate(()=>{const conn=new java.net.URL(location).openConnection();conn.doOutput=!0,conn.requestMethod="GET",conn.instanceFollowRedirects=!0,200===conn.responseCode?resolve({stream:()=>conn.inputStream,response:()=>new java.util.Scanner(conn.inputStream).useDelimiter("\\A").next()}):reject(conn.responseCode)})}),file:(...nodes)=>{const file=core.stat(...nodes).file();return{folder:()=>core.folder(file.parentFile),io:()=>file,exists:()=>file.exists(),make:()=>(console.log(...nodes),file.exists()||java.nio.file.Files.createFile(file.toPath()),core.file(...nodes)),path:()=>core.stat(file.toPath().toString()).path(),read:()=>{if(file.exists()){const output=[],reader=new java.io.BufferedReader(new java.io.FileReader(file));return reader.lines().forEach(line=>output.push(line)),reader.close(),output.join("")}return""},remove:parent=>{if(file.exists()&&file.delete(),parent&&file.parentFile.exists()){let context=file.parentFile;for(;0===context.listFiles().length;)context.delete(),context=context.parentFile}},write:data=>{core.ensure(file.parentFile.path.toString().replace(/\\/g,"/").split("/")),file.exists()||java.nio.file.Files.createFile(file.toPath());const writer=new java.io.PrintWriter(new java.io.FileWriter(file));writer.print(data),writer.close()}}},folder:(...nodes)=>{const stat=core.stat(...nodes),path=stat.path();return{file:name=>core.file(...path,name),folder:(...nodes)=>core.folder(...path,...nodes),io:()=>stat.file(),exists:()=>stat.file().exists(),make:()=>(stat.file().exists()||stat.file().mkdir(),core.folder(...nodes)),path:()=>stat.path(),remove:parent=>{if(stat.file().exists()&&core.clear(stat.file()),parent&&stat.file().parentFile.exists()){let context=stat.file().parentFile;for(;0===context.listFiles().length;)context.delete(),context=context.parentFile}}}},from:(query,array)=>array.filter(value=>value.contains(query)),keys:object=>Object.getOwnPropertyNames(object),lc:string=>string.toLowerCase(),root:`${plugin.dataFolder}`,serialize:(object,nullify,nodes)=>{let output=null;if(object&&"object"==typeof object)if(nodes=nodes||[object],"function"==typeof object[Symbol.iterator]){output=[];for(let entry of object)nodes.includes(entry)?output.push(nullify?null:new core.circular):output.push(core.serialize(entry,nullify,[...nodes,entry]))}else{output={};for(let entry in object)nodes.includes(object[entry])?output[entry]=nullify?null:new core.circular:output[entry]=core.serialize(object[entry],nullify,[...nodes,object[entry]])}else output=object;return output},stat:(...nodes)=>{const path=java.nio.file.Path.of(...nodes);return{file:()=>path.toFile(),path:()=>[...path.toString().replace(/\\/g,"/").split("/")]}},store:state=>{const db=core.store.db||(core.store.db={});return core.traverse(db,core.keys(state),{mode:"object",pre:(context,node)=>{context[node]||(context[node]=state[node])}})},text:(player,message,mode,color)=>{switch(!1!==color&&(message=core.color(message)),mode){case"action":return player.sendActionBar(message);case"title":return player.sendTitle(...message.split("\n"));default:return player.sendMessage(message)}},traverse:(context,nodes,options)=>{options||(options={});for(let node of nodes){switch(options.pre&&options.pre(context,node),options.mode){case"string":context+=node;break;case"array":context.push(node);break;case"object":context=context[node];break;case"function":context=options.next(context,node)}options.post&&options.post(context,node)}return context},values:object=>core.keys(object).map(key=>object[key])},module={apply:(source,current)=>new Promise((resolve,reject)=>{module.repo(source.slice(1)).then(repo=>{repo.release().then(latest=>{if(current===latest.data.id)reject("repository already up to date.");else{try{core.folder(core.root,"modules",source).remove(!0)}catch(error){reject("repo folder could not be removed.")}latest.download().then(download=>{try{const target=core.folder(core.root,"modules",source);core.ensure(target.io().parentFile.path.toString().replace(/\\/g,"/").split("/")),java.nio.file.Files.move(download.folder.io().toPath(),target.io().toPath(),java.nio.file.StandardCopyOption.REPLACE_EXISTING),download.folder.remove(!0),resolve(latest.data.id)}catch(reason){console.log(reason)}}).catch(()=>{reject("repository extraction failed.")})}}).catch(()=>{reject("no releases available in your current release channel.")})}).catch(()=>{reject("invalid repository.")})}),cache:{stack:[],data:{},sync:{}},context:[core.root],default:{index:"module.exports = (function (global) {\n   return {\n      /* exports */\n   }\n})(globalThis);\n",package:'{\n   "main": "./index.js"\n}\n'},download:location=>new Promise((resolve,reject)=>{core.fetch(location).then(output=>{let entry=null,result=null;const stream=new java.util.zip.ZipInputStream(output.stream()),downloads=core.folder(core.root,"downloads").make();for(;entry=stream.nextEntry;){if(entry.directory){const folder=downloads.folder(entry.name).make();result||(result=folder)}else{const target=new java.io.FileOutputStream(downloads.file(entry.name).make().io());stream.transferTo(target),target.close()}stream.closeEntry()}stream.close(),resolve({folder:result})}).catch(reason=>{reject(reason)})}),exports:{},fetch:source=>new Promise((resolve,reject)=>{core.fetch(source).then(output=>{const data=JSON.parse(output.response());return data.message?reject(data.message):resolve(data)}).catch(reason=>{reject(reason)})}),info:repo=>{if(repo){const source=module.source(repo),folder=core.folder(core.root,"modules",source),data=JSON.parse(folder.file("package.json").read()||"{}"),script=data.main?folder.file(data.main):null;return{data:data,folder:folder,installed:core.keys(module.list).includes(source),js:script?script.read():null,script:script,source:source,valid:!!data.main}}{const trusted=core.keys(module.trusted);return core.keys(module.list).map(key=>{for(let trustee of trusted)if(key===module.trusted[trustee])return trustee;return key})}},list:core.data("grakkit","modules",{}),parse:(code,source)=>{let result=void 0;const context=[...module.context];module.context.push(...source.replace(/\\/g,"/").split("/")),core.stat(...module.context).file().directory||module.context.pop();try{result=core.eval(code)}catch(error){console.error(error)}return module.context=context,module.exports={},result},release:location=>new Promise((resolve,reject)=>{module.fetch(location).then(data=>{data=data.filter(release=>!1===release.draft),"dev"===core.options.channel||(data=data.filter(release=>!1===release.prerelease)),data.length?(data=data.slice(-1)[0],resolve({data:data,download:()=>module.download(data.zipball_url)})):reject()}).catch(reason=>{reject(reason)})}),repo:source=>{const base=`https://api.github.com/repos/${source}`;return new Promise((resolve,reject)=>{module.fetch(base).then(data=>{resolve({data:data,release:()=>module.release(`${base}/releases`)})}).catch(reason=>{reject(reason)})})},require:source=>{if((source=core.lc(source)).startsWith("./")){const script=core.folder(...module.context).file(source),cache=module.cache,path=script.io().canonicalPath;return cache.data[path]?cache.data[path]:(console.log(`evaluating script: ./${path}`),cache.data[path]={},cache.stack.includes(path)?cache.data[path]:(cache.stack.push(path),Object.assign(cache.data[path],module.parse(script.read(),source))))}{const info=module.info(source);if(info.installed){if(info.valid){const cache=module.cache,path=info.script.io().canonicalPath;return cache.data[path]?cache.data[path]:(console.log(`evaluating script: ./${path}`),cache.data[path]={},cache.stack.includes(path)?cache.data[path]:(cache.stack.push(path),Object.assign(cache.data[path],module.parse(info.js,`modules/${info.source}`))))}throw"invalid-package"}return"package-unavailable"}},source:repo=>module.list[repo]?repo:`${module.trusted[repo]||repo.split("/").slice(-2).join("/")}`,trusted:{}};core.options=core.data("grakkit","options");const index={core:core,exports:module.exports,global:global,module:module,plugin:plugin,require:module.require,server:server};if(global.module)global.module.exports=index;else{core.command({name:"js",execute:(player,...args)=>{try{let output=null;const result=core.eval(args.join(" "),player);switch(toString.apply(result)){case"[object Object]":const names=core.keys(result);output=`{ ${names.map(name=>`${name}: ${core.display(result[name])}`).join(", ")} }`;break;case"[object Function]":output=`${result}`.replace(/\r/g,"");break;case"[foreign HostFunction]":let input=args.slice(-1)[0].split(".").slice(-1)[0];input.endsWith("]")&&(input=core.eval(input.replace(/.*\[/,"").slice(0,-1))),output=`hostFunction ${input}() { [native code] }`;break;default:output=core.display(result)}core.text(player,`§7${output}`,"chat",!1)}catch(error){let type="Error",message=`${error}`;if(error.stack)switch(type=error.stack.split("\n")[0].split(" ")[0].slice(0,-1),type){case"TypeError":message=error.message.split("\n")[0];break;case"SyntaxError":message=error.message.split(" ").slice(1).join(" ").split("\n")[0]}core.text(player,`§c${type}: ${message}`,"chat",!1)}},tabComplete:(player,...args)=>{const input=args.slice(-1)[0],filter=/.*(\!|\^|\&|\*|\(|\-|\+|\=|\[|\{|\||\;|\:|\,|\?|\/)/,nodes=input.replace(filter,"").split(".");let context=Object.assign({self:player},global),index=0;for(;index<nodes.length-1;){let node=nodes[index];context[node]?(context=context[node],++index):index=1/0}if(index===nodes.length-1){const segment=nodes.slice(-1)[0];return core.keys(context).filter(key=>core.lc(key).includes(core.lc(segment))).map(comp=>(input.match(filter)||[""])[0]+[...nodes.slice(0,-1),comp].join("."))}return[]}}),core.command({name:"module",execute:(player,action,repo)=>{if(action&&(action=core.lc(action)),repo&&(repo=core.lc(repo)),action)if(["add","create","remove","update"].includes(action))if(repo)if("*"===repo&&["remove","update"].includes(action)){let index=0,info=core.keys(module.list);"update"===action&&(info=info.filter(name=>-1!==module.list[name]));const loop=()=>{const source=info[index];if(++index,source)switch(action){case"remove":core.text(player,`&7module $&e ${source}&f deleting...`);try{core.folder(core.root,"modules",source).remove(!0),delete module.list[source],core.text(player,`&7module $&e ${source}&f deleted.`)}catch(error){core.text(player,`&7module $&e ${source}&c repo folder could not be removed.`)}loop();break;case"update":-1!==module.list[source]?(core.text(player,`&7module $&e ${source}&f updating...`),module.apply(source,module.list[source]).then(data=>{module.list[source]=data,core.text(player,`&7module $&e ${source}&f updated.`),loop()}).catch(error=>{core.text(player,`&7module $&e ${source}&c ${error}`),loop()})):loop()}else index<info.length?loop():0===info.length&&core.text(player,`&7module $&c there are no modules to ${action}.`)};loop()}else{let source=null,installed=null;switch(repo=repo.replace(/\\/g,"/"),action){case"add":source=`${module.trusted[repo]||repo.split("/").slice(-2).join("/")}`,installed=core.keys(module.list).includes(source),installed?core.text(player,`&7module $&e ${source}&c repository already installed.`):(core.text(player,`&7module $&e ${source}&f installing...`),module.apply(source).then(data=>{module.list[source]=data,core.text(player,`&7module $&e ${source}&f installed.`)}).catch(error=>{core.text(player,`&7module $&e ${source}&c ${error}`)}));break;case"create":if(source=repo.replace(/.*\//g,""),installed=core.keys(module.list).includes(source),installed)core.text(player,`&7module $&e ${source}&c repository already installed.`);else{core.text(player,`&7module $&e ${source}&f creating...`);try{const folder=core.folder(core.root,"modules",source);folder.file("index.js").write(module.default.index),folder.file("package.json").write(module.default.package),module.list[source]=-1,core.text(player,`&7module $&e ${source}&f created.`)}catch(error){core.text(player,`&7module $&e ${source}&c repo folder could not be created.`)}}break;case"remove":if(source=module.source(repo),installed=core.keys(module.list).includes(source),installed){core.text(player,`&7module $&e ${source}&f deleting...`);try{core.folder(core.root,"modules",source).remove(!0),delete module.list[source],core.text(player,`&7module $&e ${source}&f deleted.`)}catch(error){core.text(player,`&7module $&e ${source}&c repo folder could not be removed.`)}}else core.text(player,`&7module $&e ${source}&c repository not already installed.`);break;case"update":source=module.source(repo),installed=core.keys(module.list).includes(source),installed?-1===module.list[source]?core.text(player,`&7module $&e ${source}&c cannot update a local module.`):(core.text(player,`&7module $&e ${source}&f updating...`),module.apply(source,module.list[source]).then(data=>{module.list[source]=data,core.text(player,`&7module $&e ${source}&f updated.`)}).catch(error=>{core.text(player,`&7module $&e ${source}&c ${error}`)})):core.text(player,`&7module $&e ${source}&c repository not installed.`)}}else core.text(player,"&7module $&c no repository specified.");else if("list"===action){let keys=core.keys(module.list);0===keys.length?core.text(player,"&7module $&c there are no modules to list."):(core.text(player,"&7module $&f installed modules..."),keys.forEach(key=>core.text(player,`&7module $&e ${key}&f [${module.list[key]}]`)))}else"channel"===action?repo?["main","dev"].includes(repo)?(core.options.channel=repo,core.text(player,"&7module $&f channel updated.")):core.text(player,"&7module $&c invalid channel."):core.text(player,"&7module $&c no channel specified."):core.text(player,"&7module $&c invalid action.");else core.text(player,"&7module $&c no action specified.")},tabComplete:(player,action,repo,extra)=>{if(action&&(action=core.lc(action)),repo&&(repo=core.lc(repo)),void 0!==extra)return[];if(void 0===repo)return void 0!==action?core.from(action,["add","create","remove","update","list","channel"]):[];switch(action){case"add":return core.from(repo,core.keys(module.trusted));case"remove":case"update":let info=core.keys(module.list);return"update"===action&&(info=info.filter(name=>-1!==module.list[name])),[...core.from(repo,info),"*"];case"channel":return core.from(repo,["main","dev"]);default:return[]}}}),core.command({name:"grakkit",execute:(player,action,value)=>{if(action&&(action=core.lc(action)),value&&(value=core.lc(value)),action)switch(action){case"update":core.file("plugins/grakkit/index.js").remove(),server.reload(),core.text(player,"&fGrakkit Updated.");break;case"auto":value?["enable","disable"].includes(value)?(core.options.auto="e"===value[0],core.text(player,`&fGrakkit Auto-Updater ${core.options.auto?"En":"Dis"}abled.`)):core.text(player,"&cThat value is invalid!"):core.text(player,"&cYou must specify a value!");break;default:core.text(player,"&cThat action is invalid!")}else core.text(player,"&cYou must specify an action!")},tabComplete:(player,action,value,extra)=>(action&&(action=core.lc(action)),value&&(value=core.lc(value)),void 0!==extra?[]:void 0!==value?"auto"===action?core.from(value,["enable","disable"]):[]:void 0!==action?core.from(action,["update","auto"]):[])}),core.event("org.bukkit.event.server.PluginDisableEvent",event=>{if(event.plugin===plugin){core.options.auto&&core.file("plugins/grakkit/index.js").remove();const store=core.store({data:{}});for(let namespace in store)for(let key in store[namespace]){const file=core.folder(core.root,"data",namespace).file(`${key}.json`);file.write(JSON.stringify(core.serialize(store[namespace][key],!0)))}}}),module.fetch("https://raw.githubusercontent.com/grakkit/grakkit/master/modules.json").then(data=>{module.trusted=data}),Object.assign(global,index);try{const folder=core.folder(core.root,"scripts").make().io(),files=folder.listFiles();if(files)for(let index=0;index<files.length;++index){const file=files[index];if(!file.directory){const script=core.file(file.toPath().toString());console.log(`evaluating script: ./${script.path().join("/")}`),core.eval(script.read())}}}catch(error){console.error(error)}}}();