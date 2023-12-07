var x = window.matchMedia('(max-width:768px)')
export var is_responsive ;
export function responsive(){
    if(x.matches){
        console.log(x.matches , true )
        is_responsive = true;
    }
    else{
        console.log("false")
        is_responsive = false
    }
    }
responsive()
export function ifPhone(){
    if(is_responsive){
        document.querySelector(".back-btn").addEventListener("click" , (e)=>{
            document.querySelector('.left').classList.remove('hidden')
            document.querySelector('.right').classList.add('hidden')

        })
        document.querySelector('.left').classList.remove('hidden' , 'mx-2')
        document.querySelector('.left').classList.add('w-screen' , 'h-screen')
        document.querySelector('.right').classList.add('hidden')
        document.querySelector('.right').classList.add('w-screen')
        // document.querySelector('#scroll-container').style. = '73vh'
        document.querySelector('#scroll-container').classList.add('w-screen')
        // document.querySelectorAll('#scrt-msgs').forEach((e)=>{
        //     e.classList.remove('mr-3')
        //     console.log(e)
        // })
        // document.getElementById("current-chat-img").classList.add('w-7', 'h-7')
        console.log(document.querySelector('.right'))
        document.getElementById("homepage-img").classList.add("hidden");
  
        console.log('hell0')
    }
}
