;(function($,undefined){
	$.fn.extend({
		tms:function(opt){
			var holder=opt.holder=this
			holder
				.data({
					opt:opt=$.extend({
					duration:1000,
					easing:'',
					interval:40,
					slideShow:false,
					prevBu:false,
					nextBu:false,
					playBu:false,
					progressBar:false,
					progCSS:{width:'100%',height:'4px',background:'#f00',position:'absolute',top:0,opacity:.7,zIndex:999},
					pauseCl:'paused',
					show:0,
					pic:'.pic',
					items:'.items',
					pagination:'.pagination li',
					pagNums:true,
					pagEv:'click',
					pagCurrCl:'current',
					banners:false,
					bannerMeth:'fade',
					bannerDurr:400,
					bannerEasing:'',
					bannerCl:'banner',
					blocksX:10,
					blocksY:6,
					prevBu:false,
					nextBu:false,
					playBu:false,
					playBlock:false,
					prevNextEv:'click',
					overflow:'hidden',
					preload:false,
					reverseWay:false,
					way:'lines',/*lines, spiral, vSnake, gSnake, diagonal, chess, randomly */
					ways:{
						lines:function(){
							for(var ret=[],i=0;i<opt.maskC.length;i++)
								ret.push(opt.maskC.eq(i))
							return ret							
						},
						spiral:function(){
							var ret=[],
								step=0,
								h=opt.blocksY,
								w=opt.blocksX,
								x,y,i,
								lr=function(){
									for(i=step;i<w-1-step;i++)
										if(ret.length<opt.maskC.length)
											ret.push(opt.matrix[step][i])
										else
											return false
										rb()
								},
								rb=function(){
									for(i=step;i<h-1-step;i++)
										if(ret.length<opt.maskC.length)
											ret.push(opt.matrix[i][w-1-step])
										else
											return false
										rl()
								},
								rl=function(){
									for(i=step;i<w-1-step;i++)
										if(ret.length<opt.maskC.length)
											ret.push(opt.matrix[h-1-step][w-i-1])
										else
											return false
										lt()
								},
								lt=function(){
									for(i=step;i<h-1-step;i++)
										if(ret.length<opt.maskC.length)
											ret.push(opt.matrix[h-i-1][step])
										else
											return false
										lr(step++)
								}
							lr()
							return ret
						},
						vSnake:function(){
							var ret=[],
								h=opt.blocksY,
								w=opt.blocksX,
								j,i
							for(i=0;i<w;i++)
								for(j=0;j<h;j++)
									if(i*.5==~~(i/2))
										ret.push(opt.matrix[j][i])
									else
										ret.push(opt.matrix[h-1-j][i])
							return ret
						},
						gSnake:function(){
							var ret=[],
								h=opt.blocksY,
								w=opt.blocksX,
								j,i
							for(i=0;i<h;i++)
								for(j=0;j<w;j++)
									if(i*.5==~~(i/2))
										ret.push(opt.matrix[i][j])
									else
										ret.push(opt.matrix[i][w-1-j])
							return ret
						},
						diagonal:function(){
							var ret=[],
								h=opt.blocksY,
								w=opt.blocksX,
								i=j=n=0
							for(i=0;i<w;i++)
									for(ret[i]=[],j=0;j<=i;j++)
										if(j<h)
											ret[i].push(opt.matrix[j][i-j])
							for(i=1;i<h;i++)
								for(j=0,ret[n=ret.length]=[];j<h-i;j++)
									ret[n].push(opt.matrix[i+j][w-1-j])
							return ret
						},
						chess:function(){
							for(var i=0,ret=[[],[]],odd=0;i<opt.maskC.length;i++)
								ret[odd=odd?0:1].push(opt.maskC.eq(i))
							return ret
						},
						randomly:function(){
							for(var ret=[],n=i=0;i<opt.maskC.length;i++)
								ret.push(opt.maskC.eq(i))
							for(i=0;i<opt.maskC.length;i++)
								ret.push(ret.splice(parseInt(Math.random()*opt.maskC.length-1),1)[0])
							return ret
						}
						},
					anim:'fade', /* fade, expand, slideDown, slideLeft, slideUp, slideRight, slideFromTop, slideFromDown, slideFromLeft, slideFromRight, gSlider, vSlider, vSlideOdd, gSlideOdd */
					anims:{
						fade:function(el,last){
							$(el).each(function(){
								$(this)
									.css({opacity:0})
									.show()
									.stop()
									.animate({
											 	opacity:1
											 },{
												duration:+opt.duration,
												easing:opt.easing,
												complete:function(){
													if(last)
														opt.afterShow()
												}
											 })
							})
						},
						expand:function(el,last){	
							$(el).each(function(){
								$(this)
									.hide()
									.show(+opt.duration,function(){
										if(last)
											opt.afterShow()
									})
							})
						},
						slideDown:function(el,last){
							$(el).each(function(){
								var th=$(this).show(),
									h=th.height()
								th
									.css({height:0})
									.stop()
									.animate({
											 height:h
											 },{
												 duration:opt.duration,
												 easing:opt.easing,
												 complete:function(){
													 if(last)opt.afterShow()
												}
											})
							})
						},
						slideLeft:function(el,last){
							$(el).each(function(){
								var th=$(this).show(),
									w=th.width()
								th
									.css({width:0})
									.stop()
									.animate({
											 width:w
											 },{
												 duration:opt.duration,
												 easing:opt.easing,
												 complete:function(){
													 if(last)opt.afterShow()
												}
											})
							})
						},
						slideUp:function(el,last){
							$(el).each(function(){
								var th=$(this).show(),
									h=th.height(),
									l=th.attr('offsetLeft'),
									t=th.attr('offsetTop')
								th
									.css({height:0,top:t+h})
									.stop()
									.animate({
											 height:h
											 },{
												 duration:opt.duration,
												 easing:opt.easing,
												 step:function(now){
													 var top=t+h-now
													 th.css({
															top:top,
															backgroundPosition:'-'+l+'px -'+top+'px'
															})
												},
												 complete:function(){
													 if(last)opt.afterShow()
												}
											})
							})
						},
						slideRight:function(el,last){
							$(el).each(function(){
								var th=$(this).show(),
									w=th.width(),
									l=th.attr('offsetLeft'),
									t=th.attr('offsetTop')
								th
									.css({width:0,left:l+w})
									.stop()
									.animate({
											 width:w
											 },{
												 duration:opt.duration,
												 easing:opt.easing,
												 step:function(now){
													 var left=l+w-now
													 th.css({
															left:left,
															backgroundPosition:'-'+left+'px -'+t+'px'
															})
												},
												 complete:function(){
													 if(last)opt.afterShow()
												}
											})
							})
						},
						slideFromTop:function(el,last){
							$(el).each(function(){
								var th=$(this),
									t=th.show().css('top'),
									h=th.height()
								th									
									.css({
										 top:-h
										})
									.stop()
									.animate({
											 top:t
											 },{
											duration:+opt.duration,
											easing:opt.easing,
											complete:function(){if(last)opt.afterShow()}
											 })
							})
						},
						slideFromDown:function(el,last){
							$(el).each(function(){
								var th=$(this),
									t=th.show().css('top'),
									h=th.height()
								th									
									.css({
										 top:h
										})
									.stop()
									.animate({
											 top:t
											 },{
											duration:+opt.duration,
											easing:opt.easing,
											complete:function(){if(last)opt.afterShow()}
											 })
							})
						},
						slideFromLeft:function(el,last){
							$(el).each(function(){
								var th=$(this),
									l=th.show().css('left'),
									w=th.width()
								th									
									.css({
										 left:-w
										})
									.stop()
									.animate({
											 left:l
											 },{
											duration:+opt.duration,
											easing:opt.easing,
											complete:function(){if(last)opt.afterShow()}
											 })
							})
						},
						slideFromRight:function(el,last){
							$(el).each(function(){
								var th=$(this),
									l=th.show().css('left'),
									w=th.width()
								th									
									.css({
										 left:w
										})
									.stop()
									.animate({
											 left:l
											 },{
											duration:+opt.duration,
											easing:opt.easing,
											complete:function(){if(last)opt.afterShow()}
											 })
							})
						},
						gSlider:function(el,last){							
							var clone=opt.maskC.clone(),
								w=clone.width()
							clone
								.appendTo(opt.maskC.parent())
								.css({background:opt.pic.css('backgroundImage')})
								.show()
							el
								.show()
								.css({left:opt.direction>0?-w:w})
								.stop()
								.animate({
										 left:0
										 },{
											 duration:+opt.duration,
											 easing:opt.easing,
											 step:function(now){
												if(opt.direction>0)
													clone.css('left',now+w)
												else
													clone.css('left',now-w)
											},
											complete:function(){
												clone.remove()
												if(last)opt.afterShow()
											}
										})							
						},
						vSlider:function(el,last){							
							var clone=opt.maskC.clone(),
								h=clone.height()
							clone
								.appendTo(opt.maskC.parent())
								.css({background:opt.pic.css('backgroundImage')})
								.show()
							el
								.show()
								.css({top:opt.direction>0?-h:h})
								.stop()
								.animate({
										 top:0
										 },{
											 duration:+opt.duration,
											 easing:opt.easing,
											 step:function(now){
												if(opt.direction>0)
													clone.css('top',now+h)
												else
													clone.css('top',now-h)
											},
											complete:function(){
												clone.remove()
												if(last)opt.afterShow()
											}
										})							
						},
						vSlideOdd:function(el,last){
							$(el).each(function(){
								var th=$(this),
									t=th.show().css('top'),
									h=th.height(),
									odd=opt.odd
								th
									.css({top:odd?-h:h})
									.stop()
									.animate({
											 top:t
											 },{
											duration:+opt.duration,
											easing:opt.easing,
											complete:function(){if(last)opt.afterShow()}
											})
								opt.odd=opt.odd?false:true
							})
						},
						gSlideOdd:function(el,last){
							$(el).each(function(){
								var th=$(this),
									l=th.show().css('left'),
									w=th.width(),
									odd=opt.odd
								th
									.css({left:odd?-w:w})
									.stop()
									.animate({
											 left:l
											 },{
											duration:+opt.duration,
											easing:opt.easing,
											complete:function(){if(last)opt.afterShow()}
											})
								opt.odd=opt.odd?false:true
							})
						}
					},
					picCSS:{
							position:'relative',
							overflow:'hidden',
							zIndex:-1							
							},
					maskCSS:{
							position:'absolute',
							zIndex:0,
							left:0,
							top:0,
							width:'100%',
							height:'100%'							
					},
					progFu:function(fu){
						var opt=this
						var w=fu?opt.progressBar.width():'0px',
							wi=opt.progressBar.data('w'),
							time=fu?(wi-w)/wi*opt.slideShow:opt.slideShow
 						opt.progressBar
							.width(w)
							.stop()
							.animate({width:wi},time,'linear',function(){
															  if(fu)setTimeout(fu,1)
															  })
					},
					pagFu:function(){
						var opt=this,
							pags=opt.pags=opt.pagination===true?(function(){
																		 var ret=$('<ul>').addClass('pagination')
									  									$(opt.itms).each(function(i){
																			ret.append('<li><a href="#">'+(opt.pagNums?i+1:'')+'</a></li>')
																		})
																		ret.appendTo(opt.holder)
																		return $('>li',ret)
																		  //for(var ret=$('<ul class="pagination"></ul>'),i=1;i<=opt.itms.length;i++)
																		  	//ret.append('<li><a href="#">'+(opt.pagNums?i:'')+'</a></li>')
																		  //ret.appendTo(opt.holder)
																		  //return ret.find('li')
																		  })():$(opt.pagination),
							anchor=!!pags.find('a').length
						$(anchor?'a':'li',pags.parent()).each(function(i){
							$(this).data({num:i})
						})
						pags.parent()
							.delegate(anchor?'a':'li',opt.pagEv,function(){
								var th=$(this),
									n=th.data('num')
								if(n==opt.current||opt.bl)
									return false
								pags.removeClass(opt.pagCurrCl)
								pags.eq(n).addClass(opt.pagCurrCl)
								opt.changeFu(n)
								return false
							})
					},
					bannersFu:function(){
						var opt=this,
							banners=opt.banners=[]
						$('li',opt.items).each(function(){
							banners.push($('.'+opt.bannerCl,this))
						})
					},
					bannerShowFu:function(n){
						var opt=this
						if(opt.bannerMeth=='fade')
							opt.banners[n]
								.appendTo(opt.holder)
								.hide()
								.fadeIn()
						if(opt.bannerMeth=='slide'){
							var b=opt.banners[n],
								to,from,tmp
							b.appendTo(opt.holder)							
							to=((tmp=b.data('to'))?tmp:(b.data({to:(tmp={left:b.attr('offsetLeft'),top:b.attr('offsetTop')})})),tmp)
							b.addClass('from')
							from=((tmp=b.data('from'))?tmp:(b.data({from:(tmp={left:b.attr('offsetLeft'),top:b.attr('offsetTop')})})),tmp)
							b.removeClass('from')							
							b.css(from).stop().animate(to,{
													   duration:+opt.bannerDurr,
													   easing:opt.bannerEasing
													   		})
						}
					},
					preloadFu:function(){
						var opt=this,
							n=0,
							bufer=$('<img>').attr('src',opt.itms[0])
								.css({position:'absolute',left:'-999%'})
								.appendTo('body')
						bufer.load(function(){
							if(n<opt.itms.length-1)
								this.src=opt.itms[++n]
							else
								bufer.remove()							
						})
					},
					preFu:function(){
						var opt=this,
							img
						if(opt.show!=undefined&&opt.itms)
							//img=$('<img>').attr('src',opt.itms[opt.show]).appendTo(opt.pic),
							img=($.browser.msie&&$.browser.version<9)?$('<img src="'+opt.itms[opt.show]+'" />').appendTo(opt.pic):$('<img>').attr('src',opt.itms[opt.show]).appendTo(opt.pic),
							opt.pags.eq(opt.show).addClass(opt.pagCurrCl),
							opt.banners?opt.bannerShowFu(opt.show):void(0)
						holder.css('overflow',opt.overflow)
						img.load(function(){							
							if(opt.holder.css('position')=='static')
								opt.holder.css({position:'relative',zIndex:1})
							if(opt.progressBar===true)
								opt.progressBar=$('<div>').css(opt.progCSS).appendTo(opt.holder)
							else
								opt.progressBar=$(opt.progressBar)
							opt.progressBar.data({w:opt.progressBar.width()
						})
						
						if(opt.slideShow)
							opt.progFu(),
							timer=setInterval(function(){
								opt.nextFu()
							},opt.slideShow)
						
							opt.pic.css(opt.picCSS)
							opt.pic.css({
										width:img.width(),
										height:img.height(),
										background:'url('+img.attr('src')+') 0 0 no-repeat'
										})
							img.remove()
							opt.current=opt.buff=opt.show
							opt.mask
								.css(opt.maskCSS)
								.appendTo(opt.pic)
							})
					},
					sliceFu:function(w,h){
						var opt=this,
							eW=parseInt(opt.pic.width()/w),
							eH=parseInt(opt.pic.height()/h),
							etal=$('<div>'),
							fW=opt.pic.width()-eW*w,
							fH=opt.pic.height()-eH*h,
							x,y,
							matrix=opt.matrix=[]
								opt.mask.empty()
						for(y=0;y<h;y++)
							for(x=0;x<w;x++)
								matrix[y]=matrix[y]?matrix[y]:[],
								matrix[y][x]=etal.clone()
									.appendTo(opt.mask)
									.css({
										 left:x*eW,
										 top:y*eH,
										 position:'absolute',
										 width:x==w-1?eW+fW:eW,
										 height:y==h-1?eH+fH:eH,
										 backgroundPosition:'-'+x*eW+'px -'+y*eH+'px',
										 display:'none'
									 })
						opt.maskC=opt.mask.find('>div')
					},
					afterShow:function(){
						var opt=this
						if(opt.playBlock)
							opt.bl=false
						opt.pic.css({backgroundImage:'url('+opt.next+')'})
						opt.maskC.hide()
						if(opt.banners)
							opt.bannerShowFu(opt.current)
					},
					showFu:function(){
						var opt=this,
							way
						$(opt.banners).each(function(){$(this).detach()})
						way=opt.ways[opt.way]()
						if(opt.reverseWay)
							way.reverse()
						if(opt.int)
							clearInterval(opt.int)
						opt.int=setInterval(function(){
							if(way.length)
								opt.anims[opt.anim](way.shift(),!way.length)
							else
								clearInterval(opt.int)
						},opt.interval)
					},
					changeFu:function(n){
						var opt=this
						if(opt.maskC)	
							opt.pic.css({backgroundImage:'url('+opt.next+')'}),
							opt.maskC.stop()
						opt.next=opt.itms[n]
						opt.direction=n-opt.buff
						opt.current=opt.buff=n
						opt.pags.removeClass(opt.pagCurrCl)
						opt.pags.eq(n).addClass(opt.pagCurrCl)
						opt.sliceFu(opt.blocksX,opt.blocksY)
						opt.maskC.css({backgroundImage:'url('+opt.next+')'})
						if(opt.playBlock)
							opt.bl=true
						opt.showFu()
						clearInterval(timer)
						if(opt.slideShow&&!opt.paused)
							opt.progFu(),
							timer=setInterval(function(){
								opt.nextFu()
							},opt.slideShow)
					},
					nextFu:function(){
						var opt=this
						if(++opt.current<opt.itms.length)
							opt.changeFu(opt.current)
						else
							opt.buff=-1,
							opt.changeFu(0)
							
					},
					prevFu:function(){
						var opt=this
						if(--opt.current>=0)
							opt.changeFu(opt.current)
						else
							opt.buff=opt.itms.length,
							opt.changeFu(opt.itms.length-1)
					},
					nameMaskFu:function(){
						var opt=this,
							tmp,i,ret=[]
						if(opt.nameMask.indexOf(','))
							tmp=opt.nameMask.split(',')
						if(tmp[1].indexOf('-'))
							tmp[2]=tmp[1].split('-'),
							tmp[1]=tmp[2].shift()
						for(i=tmp[1];i<=tmp[2];i++)
							ret.push(tmp[0].replace('*',i))
						opt.itms=ret
						$(opt.items,opt.holder).hide()
					},
					parseImgFu:function(){
						var opt=this,
							items=$(opt.items+' img',opt.holder),
							itms=opt.itms=[]
						items.each(function(){
							itms.push(this.src)
						})
						$(opt.items,opt.holder).hide()
					}
					},opt,holder.data('opt'))})
				
			var pic=opt.pic=$('<div>').addClass(opt.pic).appendTo(holder),
				mask=opt.mask=$('<div>'),
				timer
			if(opt.nameMask!=undefined)
				opt.nameMaskFu()
			else
				opt.parseImgFu()
			if(opt.preload)
				opt.preloadFu()
			if(opt.pagination)
				opt.pagFu()
			if(opt.banners)
				opt.bannersFu()
			opt.preFu()
			if(opt.prevBu)
				$(opt.prevBu).bind(opt.prevNextEv,function(){
					if(opt.bl)
						return false
					else
						opt.prevFu()
					return false
				})
			if(opt.nextBu)
				$(opt.nextBu).bind(opt.prevNextEv,function(){
					if(opt.bl)
						return false
					else
						opt.nextFu()
					return false
				})
			if(opt.playBu)
				$(opt.playBu).bind('click',function(){
					opt.paused=opt.paused?false:true
					if(!opt.paused)						
						$(this).removeClass(opt.pauseCl),
						opt.progFu(function(){
											opt.nextFu()
									})
					else
						$(this).addClass(opt.pauseCl),						
						clearInterval(timer),
						opt.progressBar.stop()
					return false
				})
			if(opt.playBlock)
				opt.bl=false
			
			return holder
		}
	})
})(jQuery)
