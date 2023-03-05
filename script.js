$(".header-btn").click((function(e){e.stopPropagation(),$(".header-dropdown").toggle()})),$(document).click((function(){$(".header-dropdown").hide()}));

const sections=document.querySelectorAll(".anim"),options={root:null,threshold:0,rootMargin:"100px 0px 0px 0px"},observer=new IntersectionObserver((function(e,t){e.forEach((e=>{e.isIntersecting?(e.target.style.animation=`${e.target.dataset.anim}`,t.unobserve(e.target)):e.target.style.animation="none"}))}),options);sections.forEach((e=>{observer.observe(e)}));
