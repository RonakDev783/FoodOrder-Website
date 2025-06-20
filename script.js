const navLinks = document.querySelector('.nav-links');

        function onToggleMenu(e) {
            e.name = e.name === 'list-outline' ? 'close-outline' : 'list-outline';
            navLinks.classList.toggle('top-[15%]');
        }
