const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video:true,audio:false})
    .then(localMediaStream=> {
        console.log(localMediaStream)
        // video.src = window.URL.createObjectURL(localMediaStream);
        video.srcObject=localMediaStream;
        video.play();

    })
    .catch(err=>{
        console.error("oh noo!",err);
    })
}

function paintToCanvas(){

    let width=video.videoWidth;
    let height=video.videoHeight;

    canvas.width=width;
    canvas.height=height;

    return setInterval(()=>{
        ctx.drawImage(video,0,0,width,height);

        let pixels=ctx.getImageData(0,0,width,height);
        // console.log(pixels);
        // debugger;

        // pixels=redEffect(pixels);

        // pixels=rgb(pixels);

        // pixels=greenScreen(pixels);

        // ctx.globalAlpha=0.1;
        ctx.putImageData(pixels,0,0);
    },20);
}

function takePhoto(){
    // sound
    snap.currentTime=0;
    snap.play();

    const data=canvas.toDataURL('image/jpeg');
    // console.log(data)

    const link=document.createElement('a');
    link.href=data;
    link.setAttribute('download','handsome');
    link.innerHTML=`<img src="${data}" alt="handsome">`;
    strip.insertBefore(link,strip.firstChild);
}



function redEffect(pixels){
    for(let i=0;i<pixels.data.length;i+=4){
        pixels.data[i+0]=pixels.data[i]+50;  //red
        pixels.data[i+1]=pixels.data[i+1]-50; // green
        pixels.data[i+2]=pixels.data[i+2]*0.5; //blue         
    }
    return pixels;
}

function rgb(pixels){
    for(let i=0;i<pixels.data.length;i+=4){
        pixels.data[i-150]=pixels.data[i];  //red
        pixels.data[i+500]=pixels.data[i+1]; // green
        pixels.data[i-500]=pixels.data[i+2]*0.5;  //blue 
    }
    return pixels;
}

function greenScreen(pixels){

    let level={};

    document.querySelectorAll('input').forEach(input=>{
        level[input.name]=input.value;
    })

    for (let i = 0; i < pixels.data.length; i+=4) {
        let red=pixels.data[i];
        let green=pixels.data[i+1];
        let blue=pixels.data[i+2];

        if(red>=level.rmin 
           && red<=level.rmax
           && green>=level.gmin 
           && green<=level.gmax 
           &&blue>=level.bmin 
           && blue<=level.bmax){

            pixels.data[i+3]=0;
        }
    }
    return pixels;
}

getVideo();
video.addEventListener('canplay',paintToCanvas)