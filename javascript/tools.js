let inc_capo_button, dec_capo_button;
let inc_tone_button, dec_tone_button;
let inc_speed_button, dec_speed_button;

window.addEventListener('load', function(){
    inc_capo_button=this.document.querySelector('#inc-capo');
    dec_capo_button=this.document.querySelector('#dim-capo');
    inc_tone_button=this.document.querySelector('#inc-tone');
    dec_tone_button=this.document.querySelector('#dim-tone');
    inc_speed_button=this.document.querySelector('#inc-velocidad');
    dec_speed_button=this.document.querySelector('#dim-velocidad');

    inc_capo_button.addEventListener('click', e=>{
        console.log("Aumentar cejilla");
    });

    dec_capo_button.addEventListener('click', e=>{
        console.log("Disminuir cejilla");
    });

    inc_tone_button.addEventListener('click', e=>{
        console.log("Aumentar cejilla");
    });

    dec_tone_button.addEventListener('click', e=>{
        console.log("Disminuir tono");
    });

    inc_speed_button.addEventListener('click', e=>{
        console.log("Aumentar velocidad");
    });

    dec_speed_button.addEventListener('click', e=>{
        console.log("Disminuir velocidad");
    });
})