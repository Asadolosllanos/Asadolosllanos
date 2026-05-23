/**
 * LÓGICA DE INTERACTIVIDAD - ASADO LOS LLANOS
 * Creado con excelencia para Asado Los Llanos Premium Website
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PANTALLA DE CARGA (PRELOADER)
       ========================================================================== */
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loaderWrapper.classList.add('fade-out');
            }, 800); // Dar un respiro para que cargue fluidamente
        });
    }

    /* ==========================================================================
       2. CABECERA PEGAJOSA (STICKY HEADER)
       ========================================================================== */
    const mainHeader = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('sticky');
        } else {
            mainHeader.classList.remove('sticky');
        }
    });

    /* ==========================================================================
       3. MENÚ MÓVIL (RESPONSIVE NAVBAR)
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navbar) {
        // Alternar Menú
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Cerrar Menú al hacer click en enlaces
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    // Resaltador de enlace activo según sección activa en pantalla
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });





    /* ==========================================================================
       5. MAPA INTERACTIVO (LEAFLET.JS CON TEMA OSCURO)
       ========================================================================== */
    // Coordenadas de las Sedes
    const sedesData = {
        acarigua: {
            coords: [9.5949951, -69.2264317],
            name: "Sede Acarigua",
            address: "Av. Vencedores de Araure, al lado de refricentro, frente al club sirio venezolano, Acarigua, Portuguesa.",
            phone: "+58 424-5130580",
            schedule: "Lun - Dom: 7:00 AM - 12:00 AM"
        },
        sancarlos: {
            coords: [9.6667699, -68.5693508],
            name: "Sede San Carlos",
            address: "Av. Bolívar,Sector los silos, frente la bomba la mata, San Carlos, Cojedes.",
            phone: "+58 424-5130580",
            schedule: "Lun - Dom: 11:30 AM - 12:00 AM"
        },
        valencia: {
            coords: [10.2183509, -68.0139857],
            name: "Sede Valencia",
            address: "El Viñedo, frente al paseo la viña, Valencia, Carabobo.",
            phone: "+58 4244177850",
            schedule: "Lun - Dom: 7:00 AM - 12:00 AM"
        }
    };

    // Inicializar Mapa
    // Centrado estratégico en Cojedes (punto medio aproximado de las 3 sedes)
    const map = L.map('interactive-map', {
        scrollWheelZoom: false,
        zoomControl: true
    }).setView([9.8, -68.6], 8);

    // Servidor de Mapas Oscuros CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Icono dorado personalizado para los marcadores
    const goldIconHtml = `
        <div style="
            background-color: var(--bg-primary); 
            border: 2px solid var(--accent-gold); 
            width: 32px; 
            height: 32px; 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        ">
            <i class="fa-solid fa-fire" style="
                color: var(--accent-gold); 
                transform: rotate(45deg); 
                font-size: 0.85rem;
            "></i>
        </div>
    `;

    const customMarkerIcon = L.divIcon({
        html: goldIconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: 'custom-gold-marker'
    });

    const markersGroup = L.featureGroup();
    const markers = {};

    // Panel flotante del mapa
    const mapInfoPanel = document.getElementById('map-info-panel');

    function updateMapPanel(name, address, schedule, phone) {
        if (mapInfoPanel) {
            mapInfoPanel.innerHTML = `
                <h4 style="color: var(--accent-gold); text-transform: uppercase;">${name}</h4>
                <p style="margin-bottom: 8px;"><i class="fa-solid fa-location-dot" style="color: var(--accent-gold); margin-right: 6px;"></i> ${address}</p>
                <p style="margin-bottom: 8px;"><i class="fa-solid fa-clock" style="color: var(--accent-gold); margin-right: 6px;"></i> ${schedule}</p>
                <p style="margin-bottom: 12px;"><i class="fa-solid fa-phone" style="color: var(--accent-gold); margin-right: 6px;"></i> ${phone}</p>
                <div class="map-panel-actions">
                    <a href="#reservaciones" class="btn-panel-action" style="text-decoration:none; display:block; text-align:center; margin-bottom:8px;"><i class="fa-solid fa-calendar-check"></i> Reservar Mesa</a>
                    <button class="btn-panel-action" id="btn-focus-all-popup"><i class="fa-solid fa-earth-americas"></i> Mostrar Todas</button>
                </div>
            `;

            // Vincular evento al botón dinámico del popup panel
            const btnFocusAllPopup = document.getElementById('btn-focus-all-popup');
            if (btnFocusAllPopup) {
                btnFocusAllPopup.addEventListener('click', focusAllSedes);
            }
        }
    }

    // Agregar Marcadores al Mapa
    Object.keys(sedesData).forEach(key => {
        const sede = sedesData[key];
        const marker = L.marker(sede.coords, { icon: customMarkerIcon }).addTo(map);

        // Crear popup personalizado
        const popupContent = `
            <div class="leaflet-popup-custom-title">${sede.name}</div>
            <div class="leaflet-popup-custom-desc">
                <p><strong>Dirección:</strong> ${sede.address}</p>
                <p><strong>Horario:</strong> ${sede.schedule}</p>
            </div>
        `;

        marker.bindPopup(popupContent);
        markersGroup.addLayer(marker);
        markers[key] = marker;

        // Evento al hacer click en el marcador
        marker.on('click', () => {
            map.flyTo(sede.coords, 14, { animate: true, duration: 1.2 });
            updateMapPanel(sede.name, sede.address, sede.schedule, sede.phone);
        });
    });

    // Función para centrar todas las sedes
    function focusAllSedes() {
        map.flyToBounds(markersGroup.getBounds(), { padding: [50, 50], animate: true, duration: 1.5 });
        if (mapInfoPanel) {
            mapInfoPanel.innerHTML = `
                <h4>SELECCIONA UNA SEDE</h4>
                <p>Haz clic en los marcadores del mapa o presiona "Ver en mapa" en las tarjetas de arriba para centrar la ubicación.</p>
                <div class="map-panel-actions">
                    <button class="btn-panel-action" id="btn-focus-all"><i class="fa-solid fa-earth-americas"></i> Mostrar Todas</button>
                </div>
            `;
            // Re-vincular
            document.getElementById('btn-focus-all').addEventListener('click', focusAllSedes);
        }
    }

    // Vincular botón principal del panel
    const btnFocusAll = document.getElementById('btn-focus-all');
    if (btnFocusAll) {
        btnFocusAll.addEventListener('click', focusAllSedes);
    }

    // Interacción desde las tarjetas de Sedes de arriba
    const sedeCards = document.querySelectorAll('.sede-card');
    sedeCards.forEach(card => {
        const btnMap = card.querySelector('.btn-sede-map');
        const lat = parseFloat(card.getAttribute('data-lat'));
        const lng = parseFloat(card.getAttribute('data-lng'));
        const name = card.getAttribute('data-name');

        // Encontrar clave interna
        const key = name.toLowerCase().replace('sede ', '');
        const data = sedesData[key];

        if (btnMap) {
            btnMap.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar comportamientos del card general

                // Desplazarse al mapa con suavidad
                document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });

                // Animación y popup en mapa
                setTimeout(() => {
                    // Fly to the selected location with animation
                    map.flyTo([lat, lng], 14, { animate: true, duration: 1.5 });
                    // After the fly animation completes, explicitly set view to guarantee centering
                    setTimeout(() => {
                        map.setView([lat, lng], 14);
                    }, 1500);
                    if (markers[key]) {
                        markers[key].openPopup();
                    }
                    updateMapPanel(data.name, data.address, data.schedule, data.phone);
                }, 400);
            });
        }
    });


    /* ==========================================================================
       6. MOTOR DE RESERVACIONES POR WHATSAPP (MENSAJE PREFORMATEADO DIRECTO)
       ========================================================================== */
    const reservationForm = document.getElementById('whatsapp-reservation-form');

    // Configurar fechas mínimas del input date (Día de hoy)
    const reserveDateInput = document.getElementById('reserve-date');
    if (reserveDateInput) {
        const today = new Date().toISOString().split('T')[0];
        reserveDateInput.setAttribute('min', today);
    }

// Dynamic Area Options based on selected sede
const areaOptionsContainer = document.getElementById('area-options');
const sedeSelect = document.getElementById('reserve-sede');

function updateAreaOptions(selectedSede) {
    const areaIcons = {
        'Salón': 'fa-couch',
        'Sushi': 'fa-fish',
        'Pollo': 'fa-drumstick-bite',
        'Tarima': 'fa-microphone-lines',
        'Terraza': 'fa-umbrella-beach',
        'VIP 1': 'fa-star',
        'VIP 2': 'fa-star',
        'Planta Alta': 'fa-building'
    };
    let html = '';
    if (selectedSede === 'Acarigua') {
        const areas = ['Salón', 'Sushi', 'Pollo', 'Tarima', 'Terraza', 'VIP 1', 'VIP 2'];
        areas.forEach((area, idx) => {
            const id = `area-${area.toLowerCase().replace(/\s+/g, '')}`;
            const checked = idx === 0 ? 'checked' : '';
            const iconClass = areaIcons[area] || 'fa-circle';
            html += `
                <label class="radio-tile-label" for="${id}">
                    <input type="radio" name="reserve-area" id="${id}" value="${area}" ${checked}>
                    <div class="radio-tile">
                        <i class="fa-solid ${iconClass}"></i>
                        <span>${area}</span>
                    </div>
                </label>`;
        });
    } else if (selectedSede === 'San Carlos') {
        const area = 'Salón';
        const id = `area-${area.toLowerCase().replace(/\s+/g, '')}`;
        const iconClass = areaIcons[area] || 'fa-circle';
        html = `
            <label class="radio-tile-label" for="${id}">
                <input type="radio" name="reserve-area" id="${id}" value="${area}" checked>
                <div class="radio-tile">
                    <i class="fa-solid ${iconClass}"></i>
                    <span>${area}</span>
                </div>
            </label>`;
    } else if (selectedSede === 'Valencia') {
        const areas = ['Salón', 'Terraza', 'Planta Alta'];
        areas.forEach((area, idx) => {
            const id = `area-${area.toLowerCase().replace(/\s+/g, '')}`;
            const checked = idx === 0 ? 'checked' : '';
            const iconClass = areaIcons[area] || 'fa-circle';
            html += `
                <label class="radio-tile-label" for="${id}">
                    <input type="radio" name="reserve-area" id="${id}" value="${area}" ${checked}>
                    <div class="radio-tile">
                        <i class="fa-solid ${iconClass}"></i>
                        <span>${area}</span>
                    </div>
                </label>`;
        });
    }
    areaOptionsContainer.innerHTML = html;
}



// Manejo del Select Nativo
if (sedeSelect) {
    updateAreaOptions(sedeSelect.value);
    
    sedeSelect.addEventListener('change', (e) => {
        updateAreaOptions(e.target.value);
    });
}

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capturar datos del formulario
            const name = document.getElementById('reserve-name').value.trim();
            const guests = document.getElementById('reserve-guests').value;
            const sedeSelect = document.getElementById('reserve-sede');
            const sedeName = sedeSelect.value;
            const selectedOption = sedeSelect.options[sedeSelect.selectedIndex];
            const targetPhone = selectedOption.getAttribute('data-phone');

            const rawDate = document.getElementById('reserve-date').value;
            const time = document.getElementById('reserve-time').value;

            // Obtener valor del Radio Button para Área
            const areaActive = document.querySelector('input[name="reserve-area"]:checked');
            const area = areaActive ? areaActive.value : 'Salón';

            // Formatear Fecha para el mensaje (ej: 21/05/2026)
            const dateParts = rawDate.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

            // Validar campos adicionales
            if (!name || !guests || !rawDate || !time) {
                alert("Por favor, rellene todos los campos requeridos.");
                return;
            }

            // CONSTRUCCIÓN DEL MENSAJE WHATSAPP DE ALTA GAMA
            const whatsappMessage =
                `🔥 *SOLICITUD DE RESERVA - ASADO LOS LLANOS* 🔥

Hola, deseo realizar una reservación con los siguientes detalles:

👤 *Cliente:* ${name}
📍 *Sede:* Sede ${sedeName}
👥 *Comensales:* ${guests} personas
📅 *Fecha:* ${formattedDate}
⏰ *Hora:* ${time} hs
🏛️ *Área:* ${area}

¡Agradezco su confirmación!`;

            // Codificar mensaje para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Generar URL directa de API WhatsApp
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedMessage}`;

            // Abrir en pestaña nueva
            window.open(whatsappUrl, '_blank');
        });
    }


    /* ==========================================================================
       7. ANIMACIONES DE DESPLAZAMIENTO (SCROLL REVEAL CON INTERSECTION OBSERVER)
       ========================================================================== */
    // Buscar elementos para revelar dinámicamente
    const elementsToReveal = [
        '.section-header',
        '.sede-card',
        '.menu-item-card',
        '.menu-pdf-action-block',
        '.reservation-card-wrapper'
    ];

    // Añadir clase reveal a los elementos
    elementsToReveal.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, {
        threshold: 0.15, // Gatillar al revelar el 15% del objeto
        rootMargin: "0px 0px -50px 0px" // Reducir un poco el margen inferior para disparar en el momento justo
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

});
