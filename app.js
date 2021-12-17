const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const CONFIG_KEY = 'configs';

const audio = $('.music__board__audio');
const musicName = $('.music__board__info-name');
const musicSinger = $('.music__board__info-singer');
const btnPlay = $('.btn-play');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const rangeBtn = $('.music__board__range');
const btnLoop = $('.btn-loop');
const btnRandom = $('.btn-random');
const timePlayed = $('.music__board__timer-played');
const timeRemaining = $('.music__board__timer-remaining');
const cdDrive = $('.music__board__img');

let interval;

const songs = [
    {
        name: 'Cua là đổ',
        singer: 'Phát Hồ',
        image: 'https://tse3.mm.bing.net/th?id=OIP.XNuchO8n4ms72MCSE3rdnwHaHa&pid=Api&P=0&w=300&h=300',
        path: './music/cualado.mp3',
    },
    {
        name: 'Đau ở đây này',
        singer: 'Nal',
        image: 'https://tse2.mm.bing.net/th?id=OIP.67cSqfCCLXHnG_HDZ3luJAHaHY&pid=Api&P=0&w=300&h=300',
        path: './music/dauodaynay.mp3',
    },
    {
        name: 'Là ai từ bỏ, là ai vô tình',
        singer: 'Hương Ly',
        image: 'https://tse2.mm.bing.net/th?id=OIP.puROikN_mzO__sWtyv8dywHaHZ&pid=Api&P=0&w=300&h=300',
        path: './music/laaituboaivotinh.mp3',
    },
    {
        name: 'Thay lòng',
        singer: 'DIMZ',
        image: 'https://tse1.mm.bing.net/th?id=OIP.26bL0pz4KxsBDgLxWKVOfQHaGI&pid=Api&P=0&w=183&h=152',
        path: './music/thaylong.mp3',
    },
    {
        name: 'Yêu là cưới',
        singer: 'Phát Hồ',
        image: 'https://tse3.mm.bing.net/th?id=OIP.XNuchO8n4ms72MCSE3rdnwHaHa&pid=Api&P=0&w=300&h=300',
        path: './music/yeulacuoi.mp3',
    },
    {
        name: 'Muộn rồi mà sao còn',
        singer: 'Sơn Tùng MTP',
        image: 'https://yt3.ggpht.com/-qfdylQER4GU/AAAAAAAAAAI/AAAAAAAAAAA/QQTnVEWuEU4/s900-c-k-no/photo.jpg',
        path: './music/muonroimasaocon.mp3',
    },
    {
        name: 'Sài Gòn đau lòng quá',
        singer: 'Hứa Kim Tuyền',
        image: 'https://tse1.mm.bing.net/th?id=OIP.jPKBRsTxq8RUV4mXEoZN0AHaHa&pid=Api&P=0&w=300&h=300',
        path: './music/saigondaulongqua.mp3',
    },
    {
        name: 'Ái nộ',
        singer: 'Masew, Vũ Khôi',
        image: 'https://tse4.mm.bing.net/th?id=OIP.RN9qyY3InjOlb2N6u-VxUAHaE8&pid=Api&P=0&w=250&h=168',
        path: './music/aino.mp3',
    },
    {
        name: 'Đế Vương',
        singer: 'Đình Dũng, ACV',
        image: 'https://tse1.mm.bing.net/th?id=OIP.xxvK7Dmib36JnLG1Zvd9TwHaHZ&pid=Api&P=0&w=300&h=300',
        path: './music/devuong.mp3',
    },
];

const app = {
    arrRandom: [],
    isActiveRange: false,
    isPlaying: false,
    isLoop: false,
    isRandom: false,
    currentSong: 0,
    configs: JSON.parse(localStorage.getItem(CONFIG_KEY)) || {} ,
    setConfig(key, value) {
        this.configs[key] = value;
        localStorage.setItem(CONFIG_KEY, JSON.stringify(this.configs));
    },
    getConfig() {
        return this.configs;
    },
    loadConfig() {
        const objCofig = this.getConfig();
        if(objCofig.isLoop != undefined) {
            this.isLoop = objCofig.isLoop;
        }
        if(objCofig.isRandom != undefined) {
            this.isRandom = objCofig.isRandom;
        }
    },
    songs,
    render() {
        let htmls = this.songs.map((song, index) => {
            return `
            <div data-id = '${index}' class="music__playlist-item ${this.currentSong == index ? 'active' : ''}">
            <div class="music__playlist-item__img-wrap">
                <img src="${song.image}" alt=""
                class="music_playlist-item__img">
            </div>
            <div class="music__playlist-item__info">
                <p class="music__playlist-item__info-name">${song.name}</p>
                <p class="music__playlist-item__info-singer">${song.singer}</p>
            </div>
            </div>
            `;
        });
        $('.music__playlist-list').innerHTML = htmls.join('');
    },
    getCurrentSong() {
        const currentSong = this.songs[this.currentSong];
        audio.setAttribute('src', currentSong.path);
        cdDrive.setAttribute('src', currentSong.image);
        musicName.innerText = currentSong.name;
        musicSinger.innerText = currentSong.singer;
    },
    computeTime() {
        let minute;
        let second;
        let minuteRemaining;
        let secondRemaining;
        interval = setInterval(() => {
            minute = Math.floor(audio.currentTime / 60);
            second = Math.floor(audio.currentTime % 60);
            minuteRemaining = Math.floor((audio.duration - audio.currentTime) / 60);
            secondRemaining = Math.floor((audio.duration - audio.currentTime) % 60);
            timePlayed.innerText = `${minute}:${second < 10 ? '0' + second : second}`;
            timeRemaining.innerText = `-${minuteRemaining}: ${secondRemaining < 10 ? '0' + secondRemaining : secondRemaining}`;
            if(!this.isActiveRange) {
                rangeBtn.value = audio.currentTime * 100 / audio.duration;
                rangeBtn.style = `background-image: linear-gradient(to right, rgb(79, 6, 94) ${rangeBtn.value}%, #fff 0%);`
            }
        }, 0);
    },
    nextMusic(playlistItems){
        if(!this.isRandom) {
            this.currentSong = this.currentSong < this.songs.length - 1 ? ++this.currentSong : 0;
        }else {
            let indexRandom;
            let isInValid;
            this.arrRandom.length == this.songs.length ? this.arrRandom = [] : undefined;
            do {
                indexRandom = this.randomMusic();
                isInValid = this.arrRandom.some(item => item == indexRandom);
            }while(isInValid);
            this.arrRandom.push(indexRandom);
            console.log(this.arrRandom);
            this.currentSong = indexRandom;
        }
        this.isPlaying = false;
        this.getCurrentSong();
        playlistItems.forEach(item => item.classList.remove('active'));
        [...playlistItems].find(item => item.dataset.id == this.currentSong).classList.add('active');
        [...playlistItems].find(item => item.classList.contains('active')).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        btnPlay.click();

    },
    prevMusic(playlistItems) {
        this.currentSong = this.currentSong > 0 ? --this.currentSong : this.songs.length - 1;
        this.isPlaying = false;
        this.getCurrentSong();
        playlistItems.forEach(item => item.classList.remove('active'));
        [...playlistItems].find(item => item.dataset.id == this.currentSong).classList.add('active');
        [...playlistItems].find(item => item.classList.contains('active')).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        btnPlay.click();
    },
    randomMusic() {
        const randomIndex = Math.floor(Math.random() * this.songs.length);
        this.currentSong = randomIndex;
        return randomIndex;
    },
    handleEvent() {
        const _this = this;
        const playlistItems = $$('.music__playlist-item');
        this.getCurrentSong();
        const animate = cdDrive.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        animate.pause();
        // click play btn
        btnPlay.onclick = e => {
            if(!_this.isPlaying) {
                audio.play();
                audio.onplay = e => {
                    btnPlay.innerHTML = `<ion-icon class="music__board-icon" name="pause"></ion-icon>`;
                    _this.isPlaying = !_this.isPlaying;
                    animate.play();
                    _this.computeTime();
                }
            }else {
                audio.pause();
                audio.onpause = e => {
                    btnPlay.innerHTML = `<ion-icon class="music__board-icon" name="play"></ion-icon>`;
                    _this.isPlaying = !_this.isPlaying;
                    animate.pause();
                    clearInterval(interval);
                }
            }
        }
        // onchange range
        rangeBtn.onchange = e => {
            const newCurrentTime = e.target.value * audio.duration / 100;
            audio.currentTime = newCurrentTime;
        }
        rangeBtn.onmousedown = e => {
            _this.isActiveRange = true;
        }
        rangeBtn.onmouseup = e => {
            _this.isActiveRange = false;
        }
        btnNext.onclick = e => {
            _this.nextMusic(playlistItems);
        }
        btnPrev.onclick = e => {
            _this.prevMusic(playlistItems);
        }
        btnLoop.onclick = e => {
            if(e.target.closest('.music__board-icon')) {
                e.target.classList.toggle('active');
            }
            audio.loop = !_this.isLoop ? !_this.isLoop : !_this.isLoop;
            _this.isLoop = audio.loop;
            _this.setConfig('isLoop', _this.isLoop);
        }
        btnRandom.onclick = e => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            _this.arrRandom = [];
            _this.arrRandom.push(_this.currentSong);
            if(e.target.closest('.music__board-icon')) {
                e.target.classList.toggle('active');
            }
        }
        audio.onended = e => {
            !_this.isLoop ? _this.nextMusic(playlistItems): undefined;
        }
        playlistItems.forEach(item => {
            item.onclick = e => {
                if(!item.classList.contains('active')) {
                    const id = item.dataset.id;
                    _this.currentSong = Number(id);
                    playlistItems.forEach(p => p.classList.remove('active'));
                    item.classList.add('active');
                    _this.isPlaying = !_this.isPlaying;
                    _this.getCurrentSong();
                    btnPlay.click();
                }
                
            }
        })
    },
    start() {
        this.loadConfig();
        this.render();
        this.handleEvent();
        if(this.isLoop) {
            audio.loop = this.isLoop;
            $('.btn-loop .music__board-icon').classList.add('active');
        }
        if(this.isRandom) {
            $('.btn-random .music__board-icon').classList.add('active');
        }
        
    }
}
app.start();