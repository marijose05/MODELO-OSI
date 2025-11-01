// Funciones interactivas avanzadas

class RevistaOSI {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupInteractiveElements();
        this.setupProgressIndicator();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.setupAudioEffects();
        this.setupAccessibilityFeatures();
    }

    // Animaciones de scroll suaves
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animaciones específicas por tipo de elemento
                    if (entry.target.classList.contains('layer-card')) {
                        this.animateLayerCard(entry.target);
                    } else if (entry.target.classList.contains('hero-content')) {
                        this.animateHeroContent(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observar todos los elementos animables
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Animación de tarjetas de capas
    animateLayerCard(element) {
        const layerNumber = element.dataset.layer;
        element.style.animationDelay = `${layerNumber * 0.1}s`;
        element.classList.add('fade-in-up');
    }

    // Animación del contenido hero
    animateHeroContent(element) {
        element.classList.add('fade-in-left');
    }

    // Elementos interactivos
    setupInteractiveElements() {
        // Tooltips mejorados
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip);
            element.addEventListener('mouseleave', this.hideTooltip);
        });

        // Modales para información adicional
        document.querySelectorAll('[data-modal]').forEach(element => {
            element.addEventListener('click', this.openModal);
        });

        // Acordeones animados
        document.querySelectorAll('.accordion-trigger').forEach(trigger => {
            trigger.addEventListener('click', this.toggleAccordion);
        });

        // Tabs interactivos
        document.querySelectorAll('.tab-trigger').forEach(tab => {
            tab.addEventListener('click', this.switchTab);
        });

        // Carruseles automáticos
        this.setupCarousels();

        // Búsqueda en tiempo real
        this.setupSearchFunctionality();
    }

    // Mostrar tooltip
    showTooltip(event) {
        const element = event.target;
        const tooltipText = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        
        setTimeout(() => tooltip.style.opacity = '1', 10);
        element.tooltipElement = tooltip;
    }

    // Ocultar tooltip
    hideTooltip(event) {
        const element = event.target;
        if (element.tooltipElement) {
            element.tooltipElement.remove();
            element.tooltipElement = null;
        }
    }

    // Abrir modal
    openModal(event) {
        event.preventDefault();
        const modalId = event.target.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Cerrar modal
    closeModal() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // Toggle acordeón
    toggleAccordion(event) {
        const trigger = event.target;
        const content = trigger.nextElementSibling;
        const isOpen = content.style.maxHeight;
        
        // Cerrar todos los demás
        document.querySelectorAll('.accordion-content').forEach(acc => {
            acc.style.maxHeight = null;
        });
        
        // Toggle el actual
        if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }

    // Switch tabs
    switchTab(event) {
        const tabId = event.target.dataset.tab;
        const tabContainer = event.target.closest('.tabs-container');
        
        // Remover active de todos los tabs
        tabContainer.querySelectorAll('.tab-trigger').forEach(tab => {
            tab.classList.remove('active');
        });
        tabContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activar el tab seleccionado
        event.target.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // Configurar carruseles
    setupCarousels() {
        document.querySelectorAll('.carousel').forEach(carousel => {
            let currentSlide = 0;
            const slides = carousel.querySelectorAll('.slide');
            const totalSlides = slides.length;
            
            // Autoplay
            setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                this.updateCarousel(carousel, currentSlide);
            }, 5000);
            
            // Controles manuales
            carousel.querySelector('.next')?.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                this.updateCarousel(carousel, currentSlide);
            });
            
            carousel.querySelector('.prev')?.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                this.updateCarousel(carousel, currentSlide);
            });
        });
    }

    // Actualizar carrusel
    updateCarousel(carousel, currentSlide) {
        const slides = carousel.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });
    }

    // Función de búsqueda
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                this.performSearch(query);
            });
        }
    }

    // Realizar búsqueda
    performSearch(query) {
        const searchableElements = document.querySelectorAll('[data-searchable]');
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const isMatch = text.includes(query);
            
            if (isMatch) {
                element.classList.remove('search-hidden');
                element.classList.add('search-highlight');
            } else {
                element.classList.add('search-hidden');
                element.classList.remove('search-highlight');
            }
        });
    }

    // Indicador de progreso de lectura
    setupProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Navegación por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Navegación con flechas
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                this.navigateToNextSection();
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                this.navigateToPreviousSection();
            }
            
            // Búsqueda rápida con Ctrl+F
            if (event.ctrlKey && event.key === 'f') {
                event.preventDefault();
                document.getElementById('search-input')?.focus();
            }
            
            // Cerrar modales con Escape
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // Navegar a siguiente sección
    navigateToNextSection() {
        const sections = document.querySelectorAll('section[id]');
        const currentSection = this.getCurrentSection();
        const nextIndex = Array.from(sections).indexOf(currentSection) + 1;
        
        if (nextIndex < sections.length) {
            sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Navegar a sección anterior
    navigateToPreviousSection() {
        const sections = document.querySelectorAll('section[id]');
        const currentSection = this.getCurrentSection();
        const prevIndex = Array.from(sections).indexOf(currentSection) - 1;
        
        if (prevIndex >= 0) {
            sections[prevIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Obtener sección actual
    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        for (let section of sections) {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                return section;
            }
        }
        return sections[0];
    }

    // Gestos táctiles
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (event) => {
            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Swipe horizontal para navegación
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.navigateToPreviousSection();
                } else {
                    this.navigateToNextSection();
                }
            }
        });
    }

    // Efectos de audio
    setupAudioEffects() {
        // Crear contexto de audio para efectos
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Efectos de sonido para interacciones
        document.querySelectorAll('[data-sound]').forEach(element => {
            element.addEventListener('click', (event) => {
                const soundType = event.target.dataset.sound;
                this.playSound(soundType);
            });
        });
    }

    // Reproducir sonido
    playSound(type) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configurar frecuencia según el tipo
        const frequencies = {
            'click': 800,
            'hover': 600,
            'success': 1000,
            'error': 300
        };
        
        oscillator.frequency.setValueAtTime(frequencies[type] || 440, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Características de accesibilidad
    setupAccessibilityFeatures() {
        // Modo de alto contraste
        const contrastToggle = document.getElementById('contrast-toggle');
        if (contrastToggle) {
            contrastToggle.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
            });
        }
        
        // Tamaño de fuente ajustable
        const fontSizeControls = document.querySelectorAll('[data-font-size]');
        fontSizeControls.forEach(control => {
            control.addEventListener('click', (event) => {
                const size = event.target.dataset.fontSize;
                document.documentElement.style.fontSize = size + 'px';
            });
        });
        
        // Lectura de pantalla mejorada
        this.setupScreenReaderSupport();
    }

    // Soporte para lectores de pantalla
    setupScreenReaderSupport() {
        // Añadir descripciones ARIA
        document.querySelectorAll('.interactive-element').forEach(element => {
            element.setAttribute('aria-label', 'Elemento interactivo');
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
        });
        
        // Anuncios en vivo para lectores de pantalla
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    // Anunciar para lectores de pantalla
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Modo de impresión optimizado
    setupPrintStyles() {
        const printButton = document.getElementById('print-button');
        if (printButton) {
            printButton.addEventListener('click', () => {
                window.print();
            });
        }
    }

    // Compartir en redes sociales
    setupSocialSharing() {
        document.querySelectorAll('[data-share]').forEach(button => {
            button.addEventListener('click', (event) => {
                const platform = event.target.dataset.share;
                this.shareOnSocial(platform);
            });
        });
    }

    // Compartir en redes sociales
    shareOnSocial(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        const shareUrls = {
            'twitter': `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            'facebook': `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            'linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            'whatsapp': `https://wa.me/?text=${title}%20${url}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }

    // Modo oscuro
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    // Guardar progreso de lectura
    saveReadingProgress() {
        const progress = {
            scrollPosition: window.scrollY,
            timestamp: Date.now(),
            currentSection: this.getCurrentSection().id
        };
        localStorage.setItem('readingProgress', JSON.stringify(progress));
    }

    // Restaurar progreso de lectura
    restoreReadingProgress() {
        const saved = localStorage.getItem('readingProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            // Solo restaurar si no ha pasado mucho tiempo (24 horas)
            if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
                window.scrollTo(0, progress.scrollPosition);
            }
        }
    }

    // Estadísticas de lectura
    getReadingStats() {
        const stats = {
            totalSections: document.querySelectorAll('section[id]').length,
            currentSection: this.getCurrentSection().id,
            scrollPercentage: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
            readingTime: this.estimateReadingTime()
        };
        return stats;
    }

    // Estimar tiempo de lectura restante
    estimateReadingTime() {
        const wordsPerMinute = 200;
        const remainingText = document.body.innerText.substring(
            Math.floor((window.scrollY / document.body.scrollHeight) * document.body.innerText.length)
        );
        const wordCount = remainingText.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
}

// Inicializar la revista cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.revistaOSI = new RevistaOSI();
    
    // Restaurar progreso si existe
    window.revistaOSI.restoreReadingProgress();
    
    // Guardar progreso periódicamente
    setInterval(() => {
        window.revistaOSI.saveReadingProgress();
    }, 30000); // Cada 30 segundos
});

// Funciones de utilidad adicionales

// Formatear número de capa OSI
function formatOSILayerNumber(number) {
    const layers = {
        1: 'Física',
        2: 'Enlace de Datos',
        3: 'Red',
        4: 'Transporte',
        5: 'Sesión',
        6: 'Presentación',
        7: 'Aplicación'
    };
    return `Capa ${number} - ${layers[number]}`;
}

// Generar diagrama de red simple
function generateNetworkDiagram(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.offsetWidth;
    canvas.height = 300;
    
    // Dibujar nodos y conexiones
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    // Nodos
    for (let i = 0; i < 5; i++) {
        const x = 100 + i * 150;
        const y = 150;
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#e0f2fe';
        ctx.fill();
        ctx.stroke();
        
        // Etiquetas
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`Nodo ${i + 1}`, x, y + 35);
    }
    
    // Conexiones
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(120 + i * 150, 150);
        ctx.lineTo(230 + i * 150, 150);
        ctx.stroke();
    }
    
    container.appendChild(canvas);
}

// Crear gráfico de protocolos
function createProtocolChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const data = [
        { protocol: 'HTTP', layer: 7, usage: 95 },
        { protocol: 'TCP', layer: 4, usage: 90 },
        { protocol: 'IP', layer: 3, usage: 98 },
        { protocol: 'Ethernet', layer: 2, usage: 85 }
    ];
    
    const chart = document.createElement('div');
    chart.className = 'protocol-chart';
    chart.innerHTML = data.map(item => `
        <div class="protocol-item" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${item.protocol}</span>
                <span>Capa ${item.layer}</span>
            </div>
            <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: #3b82f6; height: 100%; width: ${item.usage}%; border-radius: 10px;"></div>
            </div>
        </div>
    `).join('');
    
    container.appendChild(chart);
}

// Simulador de tráfico de red
class NetworkSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.packets = [];
        this.isRunning = false;
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    addPacket(from, to) {
        this.packets.push({
            from: from,
            to: to,
            progress: 0,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.packets.forEach((packet, index) => {
            packet.progress += 0.02;
            
            if (packet.progress >= 1) {
                this.packets.splice(index, 1);
                return;
            }
            
            const x = packet.from.x + (packet.to.x - packet.from.x) * packet.progress;
            const y = packet.from.y + (packet.to.y - packet.from.y) * packet.progress;
            
            this.ctx.fillStyle = packet.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Exportar funciones para uso global
window.NetworkSimulator = NetworkSimulator;
window.generateNetworkDiagram = generateNetworkDiagram;
window.createProtocolChart = createProtocolChart;
window.formatOSILayerNumber = formatOSILayerNumber;