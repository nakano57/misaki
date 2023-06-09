const audioList = []
const app = new PIXI.Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        view: document.getElementById('screen')
    }
);
let char;

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
        audioList.splice(0);
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
    const screen = document.getElementById('screen');

    //重複
    if (audioList.length != 0) {
        for (var i in audioList) {
            audioList[i].stop();
        }
        audioList.splice(0);
    }

    char = new PIXI.spine.Spine(res.char.spineData);

    if(screen.width/screen.height < char.spineData.width/char.spineData.height){
        //tate hoso
        //sayuu cut
        char.scale.x=screen.height/char.spineData.height;
        char.scale.y=screen.height/char.spineData.height;
        // Centerize
        char.x = screen.width / 2;
        char.y = screen.height*0.75;
    }else{
        //yoko hoso
        //jyouge cut
        char.scale.x=screen.width/char.spineData.width;
        char.scale.y=screen.width/char.spineData.width;
        // Centerize
        char.x = screen.width / 2;
        char.y = screen.height;
    }

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

            //Play
            audios = fetch("../data/audio.json").then(r => r.json());
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

async function main() {

    // On window resize
    window.onresize = function () {
        screen.width = window.innerWidth;
        screen.height = window.innerHeight;
    }

    // Start
    // async function updateCanvas(width, height) {
    //     if (!app) {
            
    //         app.renderer.autoResize = true;
    //         app.stage.interactive = true;
    //     }else{
    //         app.renderer.resize(width, height);
    //     }
    // }
    // await updateCanvas(window.innerWidth, window.innerHeight)
    loadChar();
}

main();