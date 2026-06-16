document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.nav-menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const scrollBtn = document.getElementById('scrollBtn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function() {
            document.getElementById('character-session').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const name = document.getElementById('iName').value;
            const msg = document.getElementById('iMsg').value;

            if(name && msg) {
                const list = document.getElementById('entriesList');
                const newEntry = document.createElement('div');
                newEntry.className = 'entry';
                newEntry.innerHTML = `<div class="entry-name">👤 [${name}]</div><div class="entry-msg">${msg}</div>`;
                list.prepend(newEntry);
                
                document.getElementById('iName').value = '';
                document.getElementById('iMsg').value = '';
            } else {
                alert("이름과 메시지를 입력해주세요!");
            }
        });
    }

    window.toggleBubble = function(bubbleId) {
        document.querySelectorAll('.speech-bubble').forEach(b => {
            b.style.display = 'none';
            if (b.timer) clearTimeout(b.timer); 
        });

        const bubble = document.getElementById(bubbleId);
        bubble.style.display = 'block';
        bubble.timer = setTimeout(() => {
            bubble.style.display = 'none';
        }, 3000); 
    };

    window.toggleRoomMusic = function(event, floorId) {
        event.stopPropagation();
        const currentRoom = document.getElementById(floorId);
        const currentAudio = currentRoom.querySelector('.room-audio');
        
        document.querySelectorAll('.room-audio').forEach(audio => {
            if (audio !== currentAudio) audio.pause();
        });

        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
    };

    const inputs = document.querySelectorAll('input[name="char-toggle"]');
    const textBlocks = document.querySelectorAll('.global-dialogue-box .dialogue-text');
    
    const originalTexts = new Map();
    textBlocks.forEach(block => {
        const p = block.querySelector('p');
        if (p) {
            originalTexts.set(p, p.textContent);
            p.textContent = '';
        }
    });

    let typingTimer = null;

    function startTypingEffect() {
        if (typingTimer) clearInterval(typingTimer);
        originalTexts.forEach((text, p) => p.textContent = '');

        const checkedInput = document.querySelector('input[name="char-toggle"]:checked');
        if (!checkedInput) return;

        const charName = checkedInput.id.replace('click-', '');
        const targetBox = document.querySelector(`.${charName}-text`);
        
        if (targetBox) {
            const p = targetBox.querySelector('p');
            const fullText = originalTexts.get(p);
            
            if (p && fullText) {
                let index = 0;
                typingTimer = setInterval(() => {
                    if (index < fullText.length) {
                        p.textContent += fullText.charAt(index);
                        index++;
                    } else {
                        clearInterval(typingTimer);
                    }
                }, 50);
            }
        }
    }

    inputs.forEach(input => input.addEventListener('change', startTypingEffect));
    startTypingEffect();

    window.toggleDialogue = function(id) {
        const boxes = document.querySelectorAll('.dialogue-box');
        boxes.forEach(box => box.style.display = 'none');
        const target = document.getElementById(id);
        if(target) target.style.display = 'flex';
    };
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const currentHash = window.location.hash;
        if (currentHash && currentHash.startsWith('#floor')) {
            const activeRoom = document.querySelector(currentHash);
            if (activeRoom) {
                activeRoom.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        }
    }, 50);
});
