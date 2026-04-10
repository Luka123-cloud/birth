// index.js
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');

    if (!preloader) return;

    // основной скрытие
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 500);

    // fallback (если что-то зависло)
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 4000);
});



document.addEventListener('DOMContentLoaded', function () {
    // В index.js внутри DOMContentLoaded
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Эффект при наведении на интерактивные элементы
        const hoverElements = document.querySelectorAll(
            'button, .inventory-cell, .horizontal-mask-item, .voice-item, .music-btn, .player-close-btn'
        );
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }
    // =========================
    // ГЛОБАЛЬНЫЕ ЭЛЕМЕНТЫ
    // =========================
    const bodyMusic = document.getElementById('birthdayMusic');
    const musicBtn = document.getElementById('musicControl');
    const gallery = document.querySelector('.gallery-container');

    const page2 = document.querySelector('.page2');

    // gallery
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryRange = document.getElementById('galleryRange');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // old voice player
    const voicePlayer = document.getElementById('voicePlayer');
    const playerImage = document.getElementById('playerImage');
    const playerName = document.getElementById('playerName');
    const playlist = document.getElementById('playlist');
    const closePlayer = document.getElementById('closePlayer');

    // mask player
    const maskPlayer = document.getElementById('maskPlayer');
    const closeMaskPlayer = document.getElementById('closeMaskPlayer');
    const playerLargeImage = document.getElementById('playerLargeImage');
    const playerLargeName = document.getElementById('playerLargeName');
    const maskHorizontalList = document.getElementById('maskHorizontalList');
    const voiceList = document.getElementById('voiceList');

    const cells = document.querySelectorAll('.inventory-cell:not(.empty)');

    // =========================
    // ФОНОВАЯ МУЗЫКА
    // =========================
    let musicStarted = false;
    let musicPausedByScroll = false;
    let lastScrollY = window.scrollY;

    function showMainControls() {
        if (gallery) gallery.classList.remove('hidden');
        if (musicBtn) musicBtn.classList.remove('hidden');
    }

    function hideMainControls() {
        if (gallery) gallery.classList.add('hidden');
        if (musicBtn) musicBtn.classList.add('hidden');
    }

    function playMusic() {
        if (!bodyMusic || !musicBtn) return;

        if (!musicStarted) {
            bodyMusic.play()
                .then(() => {
                    musicStarted = true;
                    musicBtn.textContent = 'Pause ⏸';
                    musicBtn.classList.remove('hidden');
                })
                .catch(err => console.log('Ошибка воспроизведения музыки:', err));
        } else if (bodyMusic.paused && !musicPausedByScroll) {
            bodyMusic.play()
                .then(() => {
                    musicBtn.textContent = 'Pause ⏸';
                    musicBtn.classList.remove('hidden');
                })
                .catch(err => console.log('Ошибка воспроизведения музыки:', err));
        }
    }

    function pauseMusic() {
        if (!bodyMusic || !musicBtn) return;

        if (!bodyMusic.paused) {
            bodyMusic.pause();
            musicBtn.textContent = 'Play ▶';
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', function () {
            if (!bodyMusic) return;

            if (bodyMusic.paused) {
                playMusic();
                musicPausedByScroll = false;
            } else {
                pauseMusic();
            }
        });
    }

    window.addEventListener('scroll', function () {
        if (!musicBtn || !bodyMusic) return;

        const currentScrollY = window.scrollY;

        if (maskPlayer && maskPlayer.classList.contains('active')) {
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
            musicBtn.classList.add('hidden');

            if (musicStarted && !bodyMusic.paused) {
                bodyMusic.pause();
                bodyMusic.currentTime = 0;
                musicBtn.textContent = 'Play ▶';
                musicPausedByScroll = true;
            }
        }

        if (currentScrollY < 50 && currentScrollY < lastScrollY) {
            musicBtn.classList.remove('hidden');

            if (musicPausedByScroll) {
                bodyMusic.play()
                    .then(() => {
                        musicBtn.textContent = 'Pause ⏸';
                        musicPausedByScroll = false;
                    })
                    .catch(err => console.log('Ошибка возобновления:', err));
            }
        }

        if (currentScrollY < 100 && currentScrollY > 50) {
            musicBtn.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    });

    document.addEventListener('click', function startOnClick() {
        if (!musicStarted) {
            playMusic();
        }
        document.removeEventListener('click', startOnClick);
    }, { once: true });

    document.addEventListener('scroll', function startOnScroll() {
        if (!musicStarted && window.scrollY < 50) {
            playMusic();
        }
    }, { once: true });

    // =========================
    // ГАЛЕРЕЯ
    // =========================
    if (galleryTrack && galleryRange && galleryItems.length > 0) {
        let currentIndex = 0;
        const totalItems = galleryItems.length;

        function updateGalleryPosition(index) {
            galleryTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
            galleryTrack.style.transform = `translateX(-${index * 100}%)`;
        }

        galleryRange.addEventListener('input', function (e) {
            currentIndex = parseInt(e.target.value, 10);
            updateGalleryPosition(currentIndex);
        });

        galleryTrack.addEventListener('wheel', function (e) {
            e.preventDefault();

            const delta = e.deltaY > 0 ? 1 : -1;
            let newIndex = currentIndex + delta;

            if (newIndex < 0) newIndex = 0;
            if (newIndex >= totalItems) newIndex = totalItems - 1;

            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                galleryRange.value = currentIndex;
                updateGalleryPosition(currentIndex);
            }
        });

        updateGalleryPosition(0);
    }

    // =========================
    // ЭФФЕКТ ИМЕНИ НА PAGE2
    // =========================
    if (page2) {
        let nameHover = page2.querySelector('.inventory-name-hover');

        if (!nameHover) {
            nameHover = document.createElement('div');
            nameHover.className = 'inventory-name-hover';
            page2.appendChild(nameHover);
        }

        cells.forEach(cell => {
            const img = cell.querySelector('img');
            const name = cell.dataset.name || (img ? img.alt : 'Маска');

            cell.addEventListener('mouseenter', function () {
                nameHover.textContent = name;
                nameHover.classList.add('active');
            });

            cell.addEventListener('mouseleave', function () {
                nameHover.classList.remove('active');
            });
        });
    }

    // =========================
    // СТАРЫЙ VOICE PLAYER
    // =========================
    let oldPlayerAudio = null;
    let currentOldPlayingItem = null;

    if (voicePlayer && playerImage && playerName && playlist && closePlayer) {
        oldPlayerAudio = new Audio();
        oldPlayerAudio.className = 'voice-audio';
        document.body.appendChild(oldPlayerAudio);

        function openPlayer(maskName, imageSrc) {
            playerImage.src = imageSrc;
            playerName.textContent = maskName;

            playlist.innerHTML = '';

            const messages = voiceMessages[maskName] || [
                { name: 'Голосовое сообщение', file: 'default.mp3', time: '0:30' }
            ];

            messages.forEach((msg, index) => {
                const item = document.createElement('div');
                item.className = 'playlist-item';
                item.dataset.index = index;
                item.dataset.file = msg.file;

                item.innerHTML = `
                    <img src="${imageSrc}" class="playlist-item-image" alt="${maskName}">
                    <div class="playlist-item-info">
                        <div class="playlist-item-name">${msg.name}</div>
                        <div class="playlist-item-time">${msg.time}</div>
                    </div>
                    <button class="playlist-item-play">▶</button>
                `;

                const playBtn = item.querySelector('.playlist-item-play');

                playBtn.addEventListener('click', function (e) {
                    e.stopPropagation();

                    if (currentOldPlayingItem === item) {
                        if (oldPlayerAudio.paused) {
                            oldPlayerAudio.play();
                            playBtn.textContent = '⏸';
                            playBtn.classList.add('playing');
                        } else {
                            oldPlayerAudio.pause();
                            playBtn.textContent = '▶';
                            playBtn.classList.remove('playing');
                        }
                    } else {
                        if (currentOldPlayingItem) {
                            const oldBtn = currentOldPlayingItem.querySelector('.playlist-item-play');
                            if (oldBtn) {
                                oldBtn.textContent = '▶';
                                oldBtn.classList.remove('playing');
                            }
                            currentOldPlayingItem.classList.remove('active');
                        }

                        oldPlayerAudio.src = msg.file;
                        oldPlayerAudio.play();
                        playBtn.textContent = '⏸';
                        playBtn.classList.add('playing');
                        item.classList.add('active');
                        currentOldPlayingItem = item;
                    }
                });

                item.addEventListener('click', function () {
                    playBtn.click();
                });

                playlist.appendChild(item);
            });

            voicePlayer.classList.add('active');
        }

        // если вдруг хочешь использовать старый player по клику
        // сейчас не включаю его на inventory-cell, потому что у тебя уже есть maskPlayer

        closePlayer.addEventListener('click', function () {
            oldPlayerAudio.pause();
            oldPlayerAudio.currentTime = 0;
            voicePlayer.classList.remove('active');
            currentOldPlayingItem = null;
        });

        voicePlayer.addEventListener('click', function (e) {
            if (e.target === voicePlayer) {
                closePlayer.click();
            }
        });

        oldPlayerAudio.addEventListener('ended', function () {
            if (currentOldPlayingItem) {
                const playBtn = currentOldPlayingItem.querySelector('.playlist-item-play');
                if (playBtn) {
                    playBtn.textContent = '▶';
                    playBtn.classList.remove('playing');
                }
                currentOldPlayingItem.classList.remove('active');
                currentOldPlayingItem = null;
            }
        });
    }

    // =========================
    // MASK PLAYER
    // =========================
    const maskPlayerContainer = document.querySelector('.mask-player-container');
    const playerVideo = document.getElementById('playerVideo');
    const maskVideo = document.getElementById('maskVideo');

    const videoBackBtn = document.getElementById('videoBackBtn');
    const videoStopBtn = document.getElementById('videoStopBtn');
    const videoForwardBtn = document.getElementById('videoForwardBtn');
    
    const masksData = [
        { name: 'Лиана', image: 'image/lain.jpg', type: 'Воин' },
        { name: 'Вася', image: 'https://i.pinimg.com/1200x/38/e9/3e/38e93e07aad7d19d8bab7f7a10d9775f.jpg', type: 'Демон' },
        { name: 'Ильшат', image: 'image/bro.jpg', type: 'Ревность' },
        { name: 'Родители', image: 'image/pama.jpg', type: 'Дух' },
        { name: 'Зария', image: 'image/zor.jpg', type: 'Комедия' },
        { name: 'Деля', image: 'image/dela.jpg', type: 'Оборотень' },
        { name: 'Петя', image: 'https://i.pinimg.com/736x/e1/b5/d3/e1b5d3b3ee39d1ed1a594822615ecff0.jpg', type: 'Лиса' },
        { name: 'Яна', image: 'image/yanat.jpg', type: 'Тарабаркина' },
        { name: 'Сеня', image: 'image/senya.jpg', type: 'Герой' },
        { name: 'Даша', image: 'image/dasha.jpg', type: 'Стражи' },
        { name: 'Андрей', image: 'https://i.pinimg.com/736x/1d/bf/9f/1dbf9f78431418a417588dc12d86c395.jpg', type: 'Аниме' },
        { name: 'Милена', image: 'image/mil.jpg', type: 'Миленка' },
        { name: 'Бабушка', image: 'image/bab.png', type: 'Театр' },
        { name: 'Яна г', image: 'image/yanag.jpg', type: 'Герасимова' },
     ];

    const mediaData = {
        'Лиана': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: 'sound/lian.mp3', time: '0:26' }
            ]
        },
        'Вася': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: 'try1.m4a', time: '0:08' }
            ]
        },
        'Хання': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: '', time: '0:30' }
            ]
        },
        'Сеня': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: 'sound/senya.mp3', time: '0:32' }
            ]
        },
        'Яна': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: 'sound/янат.mp3', time: '0:16' }
            ]
        },
        'Зария': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: 'sound/янат.mp3', time: '0:16' }
            ]
        },
        'Яна г': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: 'sound/1.mp3', time: '0:47' }
            ]
        },
        'Милена': {
            type: 'audio',
            items: [
                { name: 'Голосовое сообщение', file: 'sound/mil.mp3', time: '2:43' }
            ]
        },
        'Бабушка': {
            name: 'Любим',
            type: 'video',
            file: 'video/babushka.mp4'
        },
        'Родители': {
            type: 'video',
            file: 'video/pama.mp4'
        },
        'Ильшат': {
            type: 'video',
            file: 'video/brar.mp4'
        },
        'Деля': {
            type: 'video',
            file: 'video/delya.mp4'
        },
        'Андрей': {
            type: 'video',
            file: 'video/andrey.mp4'
        }
    };

    let currentAudio = null;
    let currentPlayingButton = null;
    let currentVideoFile = null;
    let currentVideoButton = null;

    function playVideo(file, button) {
        if (!file || !maskVideo) return;

        // если нажали на ту же кнопку
        if (currentVideoButton === button && maskVideo.src) {
            if (!maskVideo.paused) {
                maskVideo.pause();
                button.textContent = '▶';
                button.classList.remove('playing');
            } else {
                maskVideo.play();
                button.textContent = '⏸';
                button.classList.add('playing');
            }
            return;
        }

        // если было другое видео
        if (currentVideoButton) {
            currentVideoButton.textContent = '▶';
            currentVideoButton.classList.remove('playing');
        }

        // переключаем видео
        currentVideoFile = file;
        currentVideoButton = button;

        maskVideo.src = file;
        maskVideo.load();

        maskVideo.play()
            .then(() => {
                button.textContent = '⏸';
                button.classList.add('playing');
            })
            .catch(err => {
                console.error('Ошибка видео:', file, err);
                button.textContent = '▶';
                button.classList.remove('playing');
            });

        maskVideo.onended = () => {
            if (currentVideoButton) {
                currentVideoButton.textContent = '▶';
                currentVideoButton.classList.remove('playing');
            }
            currentVideoButton = null;
        };
    }

    function stopCurrentMaskAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        if (currentPlayingButton) {
            currentPlayingButton.textContent = '▶';
            currentPlayingButton.classList.remove('playing');
        }

        currentAudio = null;
        currentPlayingButton = null;
    }

    function stopCurrentVideo() {
        if (maskVideo) {
            maskVideo.pause();
            maskVideo.currentTime = 0;
            maskVideo.removeAttribute('src');
            maskVideo.load();
        }
    }

    function openVideo(file) {
        stopCurrentMaskAudio();

        if (maskPlayerContainer) {
            maskPlayerContainer.classList.add('video-mode');
        }

        if (!maskVideo) return;

        const currentSrc = maskVideo.getAttribute('src');

        if (currentSrc === file) {
            return;
        }

        maskVideo.src = file;
        maskVideo.load();

        maskVideo.play()
            .then(() => {
                if (videoStopBtn) {
                    videoStopBtn.textContent = '⏸';
                }
            })
            .catch(err => {
                console.error('Ошибка загрузки видео:', file, err);
            });
    }

    function closeVideoMode() {
        if (maskPlayerContainer) {
            maskPlayerContainer.classList.remove('video-mode');
        }
    }

    if (videoBackBtn) {
        videoBackBtn.addEventListener('click', () => {
            if (maskVideo) {
                maskVideo.currentTime = Math.max(0, maskVideo.currentTime - 10);
            }
        });
    }

    if (videoStopBtn) {
        videoStopBtn.addEventListener('click', () => {
            if (!maskVideo || !maskVideo.src) return;

            if (maskVideo.paused) {
                maskVideo.play()
                    .then(() => {
                        videoStopBtn.textContent = '⏸';
                    })
                    .catch(err => console.error('Ошибка возобновления видео:', err));
            } else {
                maskVideo.pause();
                videoStopBtn.textContent = '▶';
            }
        });
    }

    if (videoForwardBtn) {
        videoForwardBtn.addEventListener('click', () => {
            if (maskVideo) {
                maskVideo.currentTime = Math.min(maskVideo.duration || 0, maskVideo.currentTime + 10);
            }
        });
    }

    function renderMaskList(selectedName) {
        if (!maskHorizontalList) return;

        const savedScrollLeft = maskHorizontalList.scrollLeft;
        const savedScrollTop = maskHorizontalList.scrollTop;

        maskHorizontalList.innerHTML = '';

        masksData.forEach(mask => {
            const item = document.createElement('div');
            item.className = 'horizontal-mask-item';

            if (mask.name === selectedName) {
                item.classList.add('active');
            }

            item.innerHTML = `<img src="${mask.image}" alt="${mask.name}">`;

            item.addEventListener('click', function () {
                openMask(mask.name);
            });

            maskHorizontalList.appendChild(item);
        });

        setTimeout(() => {
            maskHorizontalList.scrollLeft = savedScrollLeft;
            maskHorizontalList.scrollTop = savedScrollTop;
        }, 0);
    }

    function playVoice(file, button) {
        if (!file) return;

        if (currentPlayingButton === button && currentAudio) {
            if (!currentAudio.paused) {
                currentAudio.pause();
                button.textContent = '▶';
                button.classList.remove('playing');
            } else {
                currentAudio.play();
                button.textContent = '⏸';
                button.classList.add('playing');
            }
            return;
        }

        if (currentPlayingButton && currentAudio) {
            currentAudio.pause();
            currentPlayingButton.textContent = '▶';
            currentPlayingButton.classList.remove('playing');
        }

        if (!currentAudio) {
            currentAudio = new Audio(file);
        } else {
            currentAudio.src = file;
        }

        currentAudio.play()
            .then(() => {
                button.textContent = '⏸';
                button.classList.add('playing');
                currentPlayingButton = button;
            })
            .catch(err => {
                console.error('Ошибка загрузки аудио:', file, err);
                button.textContent = '▶';
                button.classList.remove('playing');
                button.disabled = true;
                button.style.opacity = '0.5';
            });

        currentAudio.onended = () => {
            if (currentPlayingButton) {
                currentPlayingButton.textContent = '▶';
                currentPlayingButton.classList.remove('playing');
            }
            currentPlayingButton = null;
        };

        currentAudio.onerror = () => {
            console.error('Ошибка загрузки аудио:', file);
            button.textContent = '▶';
            button.classList.remove('playing');
            button.disabled = true;
            button.style.opacity = '0.5';
        };
    }

    function renderMedia(maskName) {
        if (!voiceList) return;

        const media = mediaData[maskName];

        if (!media) {
            closeVideoMode();

            voiceList.innerHTML = `
                <div class="voice-item">
                    <div class="voice-icon">🎤</div>
                    <div class="voice-info">
                        <div class="voice-name">Голосовое сообщение</div>
                        <div class="voice-time">0:30</div>
                    </div>
                </div>
            `;
            return;
        }

        if (media.type === 'video') {
            voiceList.innerHTML = '';

            const item = document.createElement('div');
            item.className = 'voice-item';

            item.innerHTML = `
                <div class="voice-icon">♫</div>
                <div class="voice-info">
                    <div class="voice-name">Видео</div>
                    <div class="voice-time">play</div>
                </div>
                <button class="voice-play-btn">▶</button>
            `;

            const playBtn = item.querySelector('.voice-play-btn');

            playBtn.addEventListener('click', function (e) {
                e.stopPropagation();

                if (maskPlayerContainer) {
                    maskPlayerContainer.classList.add('video-mode');
                }

                playVideo(media.file, playBtn);
            });

            voiceList.appendChild(item);
            return;
        }
        closeVideoMode();
        voiceList.innerHTML = '';

        const messages = media.items || [];

        messages.forEach(msg => {
            const item = document.createElement('div');
            item.className = 'voice-item';

            item.innerHTML = `
                <div class="voice-icon">♪</div>
                <div class="voice-info">
                    <div class="voice-name">${msg.name}</div>
                    <div class="voice-time">${msg.time}</div>
                </div>
                <button class="voice-play-btn">▶</button>
            `;

            const playBtn = item.querySelector('.voice-play-btn');

            if (msg.file) {
                playBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    playVoice(msg.file, playBtn);
                });
            } else {
                playBtn.disabled = true;
                playBtn.style.opacity = '0.5';
            }

            voiceList.appendChild(item);
        });
    }

    function openMask(maskName) {
        if (!maskPlayer || !playerLargeImage || !playerLargeName) return;

        const mask = masksData.find(m => m.name === maskName);
        if (!mask) return;

        hideMainControls();

        playerLargeImage.src = mask.image;
        playerLargeImage.alt = mask.name;
        playerLargeName.textContent = mask.name;

        stopCurrentMaskAudio();
        renderMaskList(maskName);
        renderMedia(maskName);

        maskPlayer.classList.add('active');
    }

    function closeMask() {
        if (!maskPlayer) return;

        maskPlayer.classList.remove('active');

        // стоп аудио
        stopCurrentMaskAudio();

        // стоп видео (без глюков)
        if (maskVideo) {
            maskVideo.pause();
            maskVideo.currentTime = 0;
            maskVideo.removeAttribute('src');
            maskVideo.load();
        }

        // сброс кнопки видео
        if (videoStopBtn) {
            videoStopBtn.textContent = '▶';
        }

        // ❗ ВАЖНО: выключаем video-mode
        if (maskPlayerContainer) {
            maskPlayerContainer.classList.remove('video-mode');
        }

        // сброс текущих кнопок
        currentVideoButton = null;
        currentVideoFile = null;

        showMainControls();
    }

    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            const name = this.dataset.name;
            if (name) {
                openMask(name);
            }
        });
    });

    if (closeMaskPlayer) {
        closeMaskPlayer.addEventListener('click', closeMask);
    }

    if (maskPlayer) {
        maskPlayer.addEventListener('click', function (e) {
            if (e.target === maskPlayer) {
                closeMask();
            }
        });
    }
// Получаем элементы
const track = document.querySelector('.gallery-track');
const range = document.querySelector('.gallery-range');
const counter = document.querySelector('.gallery-counter');
const items = document.querySelectorAll('.gallery-item');
const totalItems = items.length;
const linesContainer = document.querySelector('.gallery-range-lines');

// Создаем вертикальные линии
function createLines() {
    linesContainer.innerHTML = '';
    for (let i = 0; i < totalItems; i++) {
        const line = document.createElement('div');
        line.classList.add('gallery-range-line');
        if (i === 0) line.classList.add('active');
        linesContainer.appendChild(line);
    }
}

// Обновляем активные линии
function updateLines(index) {
    const lines = document.querySelectorAll('.gallery-range-line');
    lines.forEach((line, i) => {
        if (i <= index) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

// Обновляем галерею
function updateGallery(index) {
    const translateX = -index * 100;
    track.style.transform = `translateX(${translateX}%)`;
    range.value = index;
    
    if (counter) {
        counter.textContent = `${index + 1} / ${totalItems}`;
    }
    
    updateLines(index);
}

// Инициализация
createLines();
range.max = totalItems - 1;
updateGallery(0);

// Событие при изменении ползунка
range.addEventListener('input', (e) => {
    const index = parseInt(e.target.value);
    updateGallery(index);
});

// Поддержка клавиатуры (стрелки влево/вправо)
document.addEventListener('keydown', (e) => {
    const currentIndex = parseInt(range.value);
    
    if (e.key === 'ArrowLeft') {
        const newIndex = Math.max(0, currentIndex - 1);
        updateGallery(newIndex);
    } else if (e.key === 'ArrowRight') {
        const newIndex = Math.min(totalItems - 1, currentIndex + 1);
        updateGallery(newIndex);
    }
});
});