let inc_capo_button, dec_capo_button;
let inc_tone_button, dec_tone_button;
let inc_speed_button, dec_speed_button;
let reestablecer_button;

let capo_input, tone_input, speed_input;

let original_capo;
let default_speed=60;
let default_tone=0;

window.addEventListener('load', function(){
    inc_capo_button=this.document.querySelector('#inc-capo');
    dec_capo_button=this.document.querySelector('#dim-capo');
    inc_tone_button=this.document.querySelector('#inc-tone');
    dec_tone_button=this.document.querySelector('#dim-tone');
    inc_speed_button=this.document.querySelector('#inc-velocidad');
    dec_speed_button=this.document.querySelector('#dim-velocidad');
    reestablecer_button=this.document.querySelector('#reestablecer');

    capo_input=this.document.querySelector('#input-ajuste-cejilla');
    tone_input=this.document.querySelector('#input-ajuste-tono');
    speed_input=this.document.querySelector('#input-ajuste-velocidad');

    const original_capo = document.getElementById("capo").innerHTML;

    capo_input.value=original_capo;
    tone_input.value=default_tone;
    speed_input.value=default_speed;


    inc_capo_button.addEventListener('click', e=>{
        console.log("Aumentar cejilla");
        if(capo_input.value<24){
            capo_input.value=+capo_input.value+1;
            incCapo(1);
        }
    });

    dec_capo_button.addEventListener('click', e=>{
        console.log("Disminuir cejilla");
        if(capo_input.value>0){
            capo_input.value-=1;
            incCapo(-1);
        }
    });

    inc_tone_button.addEventListener('click', e=>{
        console.log("Aumentar tono");
        if(tone_input.value<12){
            tone_input.value=+tone_input.value+1;
            incTone(1);
        }
    });

    dec_tone_button.addEventListener('click', e=>{
        console.log("Disminuir tono");
        if(tone_input.value>-12){
            tone_input.value-=1;
            incTone(-1);
        }
    });

    inc_speed_button.addEventListener('click', e=>{
        console.log("Aumentar velocidad");
        if(speed_input.value<100){
            speed_input.value=+speed_input.value+1;
            speed=speed_input.value;
            document.getElementById("scroll-speed-bar").value = speed;
            document.getElementById("scroll-speed-value").innerHTML = speed;
        }
    });

    dec_speed_button.addEventListener('click', e=>{
        console.log("Disminuir velocidad");
        if(speed_input.value>0){
            speed_input.value=+speed_input.value-1;
            speed=speed_input.value;
            document.getElementById("scroll-speed-bar").value = speed;
            document.getElementById("scroll-speed-value").innerHTML = speed;
        }
    });

    reestablecer_button.addEventListener('click', e=>{
        console.log("Reestablecer");
        
        incCapo(original_capo-capo_input.value);
        capo_input.value=original_capo;

        incTone(-tone_input.value);
        tone_input.value=default_tone;

        speed_input.value=default_speed;
        speed=speed_input.value;
        document.getElementById("scroll-speed-bar").value = speed;
        document.getElementById("scroll-speed-value").innerHTML = speed;
        
    });

    capo_input.addEventListener('keyup',e=>{
        if(e.key=='Enter'){
            capo_input.blur();
        }
    })

    tone_input.addEventListener('keyup',e=>{
        if(e.key=='Enter'){
            tone_input.blur();
        }
    })

    speed_input.addEventListener('keyup',e=>{
        if(e.key=='Enter'){
            speed_input.blur();
            speed=speed_input.value;
            document.getElementById("scroll-speed-bar").value = speed_input.value;
            document.getElementById("scroll-speed-value").innerHTML = speed_input.value;
        }
    })

})