let app;
let char;
let audioList = []
let audios;
let debug = 0; //set via console


function loadChar(model = "./assets/spine/misaki_home/Misaki_home@2x.skel") {
    // remove previous spine
    if (app.stage.children.length > 0) {
        app.stage.children.pop();
        app.loader.resources = {};
    }
    // remove previous audio
    if (audioList.length != 0) {
        for (var i in audioList) {
            audioList[i].stop();
        }
        audioList = [];
    }
    try {
        app.loader.resources = {};
        // load new spine
        app.loader
            .add('char', `./${model}`)
            .load(onAssetsLoaded);
    } catch (e) {
        console.error(e)
    }
}


function onAssetsLoaded(loader, res) {

    //重複
    if (audioList.length != 0) {
        for (var i in audioList) {
            audioList[i].stop();
        }
        audioList = [];
    }

    char = new PIXI.spine.Spine(res.char.spineData);

    // console.log(char)
    // console.log(char.spineData.height)
    // console.log(char.spineData.width)

    // Scaler
    char.scale.x = char.scale.y = Math.max(char.spineData.height / window.innerHeight,char.spineData.width/window.innerWidth)/2;

    // Centerize
    char.x = window.innerWidth / 2;
    char.y = window.innerHeight / 1;

    // //Play Animation
    char.state.addAnimation(0,"Start_Idle_01",false)
    char.state.addAnimation(0,'Idle_01',true,0)


    // Voiceline Listener / Handler
    char.state.addListener({
        event: function (entry, event) {
            console.log(event)

            if (event.stringValue == '')
                return;
                
            let charName = "Misaki"
            //Camalize
            if (charName.indexOf("_") != -1) {
                charName = charName.toLowerCase().replace(/([-_][a-z])/g, group =>
                    group
                        .toUpperCase()
                        .replace('-', '')
                        .replace('_', '')
                );
            }
            charName = charName.charAt(0).toUpperCase() + charName.slice(1);
            if (debug)
                console.log(charName)
            //Play
            let voice = new Howl({
                src: [audios[event.stringValue]]
            });
            // If already loaded, play it
            if (voice.state() == 'loaded')
                voice.play();
            else if (voice.state() == 'loading') {
                voice.on('load', function () {
                    voice.play();
                })
            }
            audioList.push(voice);
        }
    })
    //Add to main canvas
    app.stage.addChild(char);
}