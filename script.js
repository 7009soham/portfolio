// Enhanced Galaxy Animation and Interactive Effects
class GalaxyAnimation {
  constructor() {
    this.container = document.getElementById('galaxyContainer');
    this.cursorGlow = document.getElementById('cursorGlow');
    this.layers = document.querySelectorAll('.galaxy-layer');
    this.dots = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isTouch = 'ontouchstart' in window;
    this.animationFrame = null;
    this.mouseTrails = [];
    this.interactionCooldown = false;
    this.customCursor = null;
    
    this.init();
  }
  
  init() {
    this.createCustomCursor();
    this.createGalaxyDots();
    this.bindEvents();
    this.startAnimation();
    this.createNebulaEffect();
  }
  
  createCustomCursor() {
    if (this.isTouch) return; // No custom cursor on touch devices
    
    this.customCursor = document.createElement('div');
    this.customCursor.className = 'custom-cursor meteor-cursor';
    document.body.appendChild(this.customCursor);
    
    // Switch between meteor and star cursor randomly
    setInterval(() => {
      if (Math.random() > 0.7) {
        this.customCursor.className = 'custom-cursor star-cursor';
        setTimeout(() => {
          this.customCursor.className = 'custom-cursor meteor-cursor';
        }, 2000);
      }
    }, 5000);
  }
  
  createGalaxyDots() {
    // Drastically reduce dot count for better performance
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    let dotsPerLayer;
    if (isMobile || isLowEnd) {
      dotsPerLayer = 15; // Much fewer dots on mobile/low-end
    } else if (isTablet) {
      dotsPerLayer = 25;
    } else {
      dotsPerLayer = 40; // Reduced from 120 to 40
    }
    
    this.layers.forEach((layer, layerIndex) => {
      // Skip creating dots for hidden layers
      if (isMobile && layerIndex > 1) return;
      if (isTablet && layerIndex > 2) return;
      
      for (let i = 0; i < dotsPerLayer; i++) {
        const dot = this.createDot(layerIndex, i, dotsPerLayer);
        layer.appendChild(dot);
        this.dots.push({
          element: dot,
          originalX: parseFloat(dot.style.left),
          originalY: parseFloat(dot.style.top),
          layer: layerIndex
        });
      }
    });
  }
  
  createDot(layerIndex, index, totalDots) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // Create more natural galaxy distribution
    const angle = (index / totalDots) * 2 * Math.PI + (layerIndex * 0.5);
    const spiralTightness = 0.3;
    const maxRadius = 45;
    const radius = Math.pow(Math.random(), 0.7) * maxRadius;
    
    // Spiral arm calculation for realistic galaxy structure
    const spiralAngle = angle + (radius * spiralTightness);
    const x = 50 + (radius * Math.cos(spiralAngle));
    const y = 50 + (radius * Math.sin(spiralAngle));
    
    // Add some scatter for realism
    const scatter = 3;
    const finalX = Math.max(5, Math.min(95, x + (Math.random() - 0.5) * scatter));
    const finalY = Math.max(5, Math.min(95, y + (Math.random() - 0.5) * scatter));
    
    dot.style.left = `${finalX}%`;
    dot.style.top = `${finalY}%`;
    
    // Enhanced dot classification with more variety
    const rand = Math.random();
    const distance = Math.sqrt(Math.pow(finalX - 50, 2) + Math.pow(finalY - 50, 2));
    
    if (rand > 0.95) {
      dot.classList.add('large');
    } else if (rand > 0.85 && distance > 20) {
      dot.classList.add('accent');
    } else if (rand > 0.7) {
      dot.classList.add('secondary');
    } else if (rand > 0.6) {
      dot.classList.add('tertiary');
    }
    
    // More subtle twinkle animations - less frequent and slower
    const shouldTwinkle = Math.random() > 0.6; // Only 40% of dots twinkle
    if (shouldTwinkle) {
      const twinkleSpeed = 4 + Math.random() * 8; // Much slower twinkle (4-12s)
      const twinkleDelay = Math.random() * 10;
      dot.style.animation = `twinkle ${twinkleSpeed}s infinite ${twinkleDelay}s`;
    }
    
    return dot;
  }
  
  createNebulaEffect() {
    // Add subtle background nebula layers
    const nebulaCount = 3;
    for (let i = 0; i < nebulaCount; i++) {
      const nebula = document.createElement('div');
      nebula.style.position = 'absolute';
      nebula.style.width = '100%';
      nebula.style.height = '100%';
      nebula.style.background = `
        radial-gradient(ellipse at ${20 + i * 30}% ${30 + i * 20}%, 
        rgba(${i === 0 ? '0, 255, 136' : i === 1 ? '0, 102, 255' : '255, 107, 107'}, 0.03) 0%, 
        transparent 60%)`;
      nebula.style.animation = `nebulaFlow ${20 + i * 10}s ease-in-out infinite`;
      nebula.style.zIndex = '-1';
      this.container.appendChild(nebula);
    }
  }
  
  bindEvents() {
    if (!this.isTouch) {
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.updateCustomCursor(e.clientX, e.clientY);
        this.updateCursorGlow(e.clientX, e.clientY);
        this.createMouseTrail(e.clientX, e.clientY);
        this.attractDots(e.clientX, e.clientY);
        this.rotateGalaxyLayers(e.clientX, e.clientY);
      });
      
      document.addEventListener('mouseenter', () => {
        this.cursorGlow.classList.add('active');
        if (this.customCursor) this.customCursor.style.opacity = '1';
      });
      
      document.addEventListener('mouseleave', () => {
        this.cursorGlow.classList.remove('active');
        if (this.customCursor) this.customCursor.style.opacity = '0';
        this.resetGalaxyLayers();
      });
    }
    
    // Enhanced touch/click interactions
    document.addEventListener(this.isTouch ? 'touchstart' : 'click', (e) => {
      if (this.interactionCooldown) return;
      
      const x = this.isTouch ? e.touches[0].clientX : e.clientX;
      const y = this.isTouch ? e.touches[0].clientY : e.clientY;
      
      this.createInteractionEffect(x, y);
      this.createStarBurst(x, y);
      this.pulsateGalaxy();
      this.interactionCooldown = true;
      
      setTimeout(() => {
        this.interactionCooldown = false;
      }, 300);
    });
    
    // Touch move for mobile
    if (this.isTouch) {
      document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        this.attractDots(touch.clientX, touch.clientY);
        this.rotateGalaxyLayers(touch.clientX, touch.clientY);
      });
      
      document.addEventListener('touchend', () => {
        this.resetGalaxyLayers();
      });
    }
    
    // Handle resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }
  
  updateCustomCursor(x, y) {
    if (this.customCursor) {
      this.customCursor.style.left = `${x}px`;
      this.customCursor.style.top = `${y}px`;
    }
  }
  
  rotateGalaxyLayers(x, y) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate much more dramatic movements
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Create dramatic rotation and scaling effects
    this.layers.forEach((layer, index) => {
      const multiplier = (index + 1) * 2; // Much stronger multiplier
      const rotationX = deltaY * 15 * multiplier; // Increased from 2 to 15
      const rotationZ = deltaX * 25 * multiplier; // Increased from 3 to 25
      const rotationY = (deltaX + deltaY) * 10 * multiplier; // Added Y rotation
      
      // Add expansion/contraction based on distance from center
      const scale = 1 + (distance * 0.3 * (index + 1)); // Expansion effect
      const translateZ = distance * 100 * (index + 1); // Depth effect
      
      layer.style.transform = `
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg) 
        rotateZ(${rotationZ}deg) 
        scale(${scale}) 
        translateZ(${translateZ}px)
      `;
      
      // Add opacity variation for depth
      layer.style.opacity = Math.max(0.3, 0.9 - (distance * 0.3));
    });
    
    // Also rotate the entire container for even more dramatic effect
    this.container.style.transform = `
      perspective(1000px) 
      rotateX(${deltaY * 5}deg) 
      rotateY(${deltaX * 5}deg)
    `;
  }
  
  pulsateGalaxy() {
    // Create a dramatic pulsation effect on interaction
    this.layers.forEach((layer, index) => {
      layer.style.animation = `galaxyPulse 0.8s ease-out`;
      setTimeout(() => {
        layer.style.animation = '';
      }, 800);
    });
  }
  
  resetGalaxyLayers() {
    // Smoothly return layers to original position
    this.layers.forEach(layer => {
      layer.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) translateZ(0px)';
      layer.style.opacity = '';
    });
    
    this.container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }
  
  attractDots(x, y) {
    // Subtle attraction effect for nearby dots
    const attractionRadius = 150;
    const attractionStrength = 10;
    
    this.dots.forEach(dotInfo => {
      const dot = dotInfo.element;
      const rect = dot.getBoundingClientRect();
      const dotX = rect.left + rect.width / 2;
      const dotY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(Math.pow(x - dotX, 2) + Math.pow(y - dotY, 2));
      
      if (distance < attractionRadius) {
        const force = (attractionRadius - distance) / attractionRadius;
        const angle = Math.atan2(y - dotY, x - dotX);
        
        const offsetX = Math.cos(angle) * force * attractionStrength;
        const offsetY = Math.sin(angle) * force * attractionStrength;
        
        dot.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + force * 0.5})`;
        dot.style.opacity = Math.min(1, 0.8 + force * 0.3);
      } else {
        dot.style.transform = '';
        dot.style.opacity = '';
      }
    });
  }
  
  createStarBurst(x, y) {
    // Create multiple particles in a burst pattern
    const particleCount = this.isTouch ? 8 : 12;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = '3px';
      particle.style.height = '3px';
      particle.style.background = `hsl(${120 + Math.random() * 60}, 100%, 60%)`;
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '100';
      particle.style.boxShadow = '0 0 6px currentColor';
      
      const angle = (i / particleCount) * 2 * Math.PI;
      const velocity = 50 + Math.random() * 100;
      const lifetime = 1000 + Math.random() * 500;
      
      particle.style.animation = `starBirth 0.3s ease-out`;
      
      document.body.appendChild(particle);
      
      // Animate particle
      let startTime = Date.now();
      const animateParticle = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / lifetime;
        
        if (progress >= 1) {
          particle.remove();
          return;
        }
        
        const distance = velocity * progress;
        const x_offset = Math.cos(angle) * distance;
        const y_offset = Math.sin(angle) * distance - (progress * progress * 50); // gravity
        
        particle.style.transform = `translate(${x_offset}px, ${y_offset}px)`;
        particle.style.opacity = 1 - progress;
        
        requestAnimationFrame(animateParticle);
      };
      
      requestAnimationFrame(animateParticle);
    }
  }
  
  updateCursorGlow(x, y) {
    this.cursorGlow.style.left = `${x}px`;
    this.cursorGlow.style.top = `${y}px`;
  }
  
  createMouseTrail(x, y) {
    // Throttle trail creation for better performance
    if (this.mouseTrails.length > 0) {
      const lastTrail = this.mouseTrails[this.mouseTrails.length - 1];
      const distance = Math.sqrt(Math.pow(x - lastTrail.x, 2) + Math.pow(y - lastTrail.y, 2));
      if (distance < 20) return; // Skip if too close to last trail
    }
    
    if (Math.random() > 0.8) { // Reduce frequency for performance
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      
      document.body.appendChild(trail);
      this.mouseTrails.push({ element: trail, x, y });
      
      // Clean up after animation
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
        this.mouseTrails = this.mouseTrails.filter(t => t.element !== trail);
      }, 800);
    }
  }
  
  createInteractionEffect(x, y) {
    // Enhanced ripple effect with better animation
    const ripple = document.createElement('div');
    ripple.className = 'interaction-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    document.body.appendChild(ripple);
    
    // Clean up after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 800);
    
    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 600);
    
    // Affect nearby dots
    this.affectNearbyDots(x, y);
  }
  
  affectNearbyDots(x, y) {
    const effectRadius = 150;
    
    this.dots.forEach(dot => {
      const rect = dot.getBoundingClientRect();
      const dotX = rect.left + rect.width / 2;
      const dotY = rect.top + rect.height / 2;
      const distance = Math.sqrt(Math.pow(x - dotX, 2) + Math.pow(y - dotY, 2));
      
      if (distance < effectRadius) {
        const intensity = 1 - (distance / effectRadius);
        dot.style.transform = `scale(${1 + intensity * 2})`;
        dot.style.boxShadow = `0 0 ${10 + intensity * 20}px rgba(0, 255, 136, ${0.5 + intensity * 0.5})`;
        
        setTimeout(() => {
          dot.style.transform = '';
          dot.style.boxShadow = '';
        }, 500);
      }
    });
  }
  
  startAnimation() {
    // Initialize performance optimizations
    this.optimizeForDevice();
    
    // Start any continuous animations here if needed
    this.animationFrame = requestAnimationFrame(() => {
      this.updateAnimations();
    });
  }
  
  optimizeForDevice() {
    // Detect device capabilities and adjust accordingly
    const isMobile = window.innerWidth < 768;
    const isSlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    if (isMobile || isSlowDevice) {
      // Reduce animation complexity
      document.documentElement.style.setProperty('--galaxy-speed', '40s');
      
      // Disable cursor glow on low-end devices
      if (this.cursorGlow) {
        this.cursorGlow.style.display = 'none';
      }
      
      // Reduce twinkle frequency
      this.dots.forEach(dotInfo => {
        if (Math.random() > 0.5) {
          dotInfo.element.style.animation = 'none';
        }
      });
    }
  }
  
  updateAnimations() {
    // Update any frame-based animations here
    // For now, just continue the animation loop
    this.animationFrame = requestAnimationFrame(() => {
      this.updateAnimations();
    });
  }
  
  updateGalaxyAnimation() {
    // Add subtle mouse influence to galaxy rotation
    if (!this.isTouch && this.mouseX !== 0 && this.mouseY !== 0) {
      const mouseInfluenceX = (this.mouseX / window.innerWidth - 0.5) * 0.5;
      const mouseInfluenceY = (this.mouseY / window.innerHeight - 0.5) * 0.5;
      
      this.layers.forEach((layer, index) => {
        const influence = (index + 1) * mouseInfluenceX * 2;
        layer.style.transform = `rotate(${influence}deg)`;
      });
    }
  }
  startAnimation() {
    // Use requestAnimationFrame for smooth animations
    const animate = () => {
      this.animationFrame = requestAnimationFrame(animate);
      
      // Add subtle floating animation to some dots
      if (Math.random() > 0.995) {
        const randomDot = this.dots[Math.floor(Math.random() * this.dots.length)];
        if (randomDot && randomDot.element) {
          randomDot.element.style.animation += ', starBirth 2s ease-in-out';
        }
      }
    };
    
    animate();
  }
  
  handleResize() {
    // Performance-optimized resize handling
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    
    // Clear existing dots and recreate for responsive behavior
    this.dots.forEach(dotInfo => {
      if (dotInfo.element.parentNode) {
        dotInfo.element.parentNode.removeChild(dotInfo.element);
      }
    });
    
    this.dots = [];
    this.layers.forEach(layer => {
      layer.innerHTML = '';
    });
    
    // Adjust galaxy layers based on device capability
    if (isMobile) {
      // Hide 3rd and 4th layers on mobile for performance
      if (this.layers[2]) this.layers[2].style.display = 'none';
      if (this.layers[3]) this.layers[3].style.display = 'none';
    } else if (isTablet) {
      // Hide only 4th layer on tablet
      if (this.layers[2]) this.layers[2].style.display = 'block';
      if (this.layers[3]) this.layers[3].style.display = 'none';
    } else {
      // Show all layers on desktop
      this.layers.forEach(layer => {
        layer.style.display = 'block';
      });
    }
    
    // Recreate with appropriate count for new screen size
    this.createGalaxyDots();
  }
  
  destroy() {
    // Clean up method for performance
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.dots.forEach(dotInfo => {
      if (dotInfo.element.parentNode) {
        dotInfo.element.parentNode.removeChild(dotInfo.element);
      }
    });
    
    this.mouseTrails.forEach(trail => {
      if (trail.element.parentNode) {
        trail.element.parentNode.removeChild(trail.element);
      }
    });
  }
}

// Initialize Galaxy Animation
let galaxyAnimation;
document.addEventListener('DOMContentLoaded', function() {
  galaxyAnimation = new GalaxyAnimation();
  
  // Mobile Navigation Toggle with debouncing for better performance
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  let isToggling = false;
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      if (isToggling) return;
      
      isToggling = true;
      
      requestAnimationFrame(() => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        
        setTimeout(() => {
          isToggling = false;
        }, 300);
      });
    });
    
    // Close mobile nav when clicking on a link
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        requestAnimationFrame(() => {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
        });
      }
    });
  
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        if (navLinks.classList.contains('open')) {
          requestAnimationFrame(() => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
          });
        }
      }
    });
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      } catch (error) {
        console.warn('Smooth scroll failed:', error);
      }
    });
  });
// Mobile tooltip functionality - WORKING VERSION
  function initMobileTooltips() {
    try {
      if (window.innerWidth <= 768) {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other tooltips
            skillItems.forEach(otherItem => {
              if (otherItem !== item) {
                otherItem.classList.remove('active');
              }
            });
            
            // Toggle current tooltip
            this.classList.toggle('active');
          });
        });
        
        // Close tooltip when clicking outside
        document.addEventListener('click', function(e) {
          if (!e.target.closest('.skill-item')) {
            skillItems.forEach(item => {
              item.classList.remove('active');
            });
          }
        });
      }
    } catch (error) {
      console.warn('Mobile tooltips failed:', error);
    }
  }
  
  // Initialize mobile tooltips
  initMobileTooltips();
  
  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      document.querySelectorAll('.skill-item').forEach(item => {
        item.classList.remove('active');
      });
      initMobileTooltips();
    }, 250);
  });

  
  
  // Enhanced Navbar background change on scroll with mobile optimization
  let scrollTimeout;
  const isMobileDevice = window.innerWidth <= 768;
  const scrollThrottle = isMobileDevice ? 100 : 16; // Less frequent on mobile
  
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        const scrolled = window.scrollY > 100;
        
        if (scrolled) {
          navbar.style.background = 'rgba(10, 10, 15, 0.98)';
          navbar.style.backdropFilter = 'blur(20px)';
          navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
          navbar.style.background = 'rgba(10, 10, 15, 0.95)';
          navbar.style.backdropFilter = 'blur(10px)';
          navbar.style.boxShadow = 'none';
        }
      }
      scrollTimeout = null;
    }, scrollThrottle);
  }, { passive: true });
  
  // Enhanced skill bars animation with intersection observer
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const skillBar = entry.target.querySelector('.skill-progress');
        if (skillBar) {
          const percentage = skillBar.style.width;
          skillBar.style.width = '0%';
          
          setTimeout(() => {
            skillBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            skillBar.style.width = percentage;
          }, index * 100);
        }
        
        // Add slide-in animation to skill items
        entry.target.style.animation = `slideInFromBottom 0.6s ease-out ${index * 0.1}s forwards`;
      }
    });
  }, observerOptions);
  
  // Enhanced scroll reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const animationType = entry.target.dataset.animation || 'slideInFromBottom';
        entry.target.style.animation = `${animationType} 0.8s ease-out ${index * 0.1}s forwards`;
        entry.target.style.opacity = '1';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe skill items
  document.querySelectorAll('.skill-item').forEach(skill => {
    skillObserver.observe(skill);
  });
  
  // Observe other elements for reveal animations
  document.querySelectorAll('.project-card, .hobby-card, .contact-card, .section-title').forEach((element, index) => {
    element.style.opacity = '0';
    element.dataset.animation = index % 2 === 0 ? 'slideInFromLeft' : 'slideInFromRight';
    revealObserver.observe(element);
  });
  
  // Enhanced mobile optimizations
  if (window.innerWidth <= 768) {
    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
    document.documentElement.style.setProperty('--galaxy-speed', '30s');
    document.documentElement.style.setProperty('--dot-size', '1px');
  }
  
  // Touch improvements
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    const touchElements = document.querySelectorAll('.btn, .card-link, .nav-links a, .project-card, .hobby-card');
    touchElements.forEach(element => {
      element.addEventListener('touchstart', function(e) {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      element.addEventListener('touchend', function(e) {
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      }, { passive: true });
    });
  }
  
  // Enhanced Performance optimization: Better animation handling for tab visibility and focus
  let isPageVisible = !document.hidden;
  let isPageFocused = document.hasFocus();
  let galaxyInstance = null;
  let animationsPaused = false;
  
  // More robust animation state management
  function handleAnimationState() {
    const galaxyContainer = document.getElementById('galaxyContainer');
    const shouldPause = !isPageVisible || !isPageFocused;
    
    if (shouldPause && !animationsPaused) {
      animationsPaused = true;
      
      if (galaxyContainer) {
        // Pause all CSS animations
        galaxyContainer.style.animationPlayState = 'paused';
        
        // Pause dot animations
        galaxyContainer.querySelectorAll('.dot').forEach(dot => {
          dot.style.animationPlayState = 'paused';
        });
        
        // Pause galaxy layer animations
        galaxyContainer.querySelectorAll('.galaxy-layer').forEach(layer => {
          layer.style.animationPlayState = 'paused';
        });
        
        // Pause nebula animations
        galaxyContainer.querySelectorAll('div[style*="nebulaFlow"]').forEach(nebula => {
          nebula.style.animationPlayState = 'paused';
        });
        
        // Stop JS animations
        if (galaxyInstance && galaxyInstance.animationFrame) {
          cancelAnimationFrame(galaxyInstance.animationFrame);
          galaxyInstance.animationFrame = null;
        }
      }
    } else if (!shouldPause && animationsPaused) {
      animationsPaused = false;
      
      if (galaxyContainer) {
        // Resume all CSS animations
        galaxyContainer.style.animationPlayState = 'running';
        
        // Resume dot animations
        galaxyContainer.querySelectorAll('.dot').forEach(dot => {
          dot.style.animationPlayState = 'running';
        });
        
        // Resume galaxy layer animations
        galaxyContainer.querySelectorAll('.galaxy-layer').forEach(layer => {
          layer.style.animationPlayState = 'running';
        });
        
        // Resume nebula animations
        galaxyContainer.querySelectorAll('div[style*="nebulaFlow"]').forEach(nebula => {
          nebula.style.animationPlayState = 'running';
        });
        
        // Restart JS animations
        if (galaxyInstance && !galaxyInstance.animationFrame) {
          galaxyInstance.startAnimation();
        }
      }
    }
  }
  
  // Multiple event listeners for comprehensive coverage
  document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
    // Add small delay to ensure state is properly updated
    setTimeout(handleAnimationState, 50);
  });
  
  window.addEventListener('focus', function() {
    isPageFocused = true;
    setTimeout(handleAnimationState, 50);
  });
  
  window.addEventListener('blur', function() {
    isPageFocused = false;
    setTimeout(handleAnimationState, 50);
  });
  
  // Additional events for better coverage
  window.addEventListener('pagehide', function() {
    isPageVisible = false;
    isPageFocused = false;
    handleAnimationState();
  });
  
  window.addEventListener('pageshow', function() {
    isPageVisible = true;
    isPageFocused = true;
    setTimeout(handleAnimationState, 100);
  });
  
  // Handle window minimize/restore (Windows specific)
  window.addEventListener('beforeunload', function() {
    isPageVisible = false;
    isPageFocused = false;
    handleAnimationState();
  });
  
  // Scrollspy functionality for navbar
  function initScrollspy() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = Array.from(navLinks).map(link => {
      const id = link.getAttribute('href').substring(1);
      return document.getElementById(id);
    }).filter(section => section !== null);
    
    function updateActiveNav() {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      let currentSection = '';
      
      // Check each section to see which one is currently in view
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // 100px offset for navbar
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          currentSection = section.id;
        }
      });
      
      // If we're at the very top, make sure 'home' is active
      if (scrollY < 100) {
        currentSection = 'home';
      }
      
      // Update active nav link
      navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').substring(1);
        if (linkHref === currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // Throttled scroll handler for better performance
    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    // Initial call and event listener
    updateActiveNav();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Smooth scroll behavior for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // Initialize scrollspy
  initScrollspy();

  // Store galaxy instance reference for animation control
  if (typeof galaxyAnimation !== 'undefined') {
    galaxyInstance = galaxyAnimation;
  } else {
    // Wait for galaxy animation to be created
    setTimeout(() => {
      if (typeof galaxyAnimation !== 'undefined') {
        galaxyInstance = galaxyAnimation;
      }
    }, 100);
  }

  // Add this after line 921 (after the galaxy instance code)

// Mobile tooltip functionality - Add this after line 921
document.addEventListener('DOMContentLoaded', function() {
    // Mobile tooltip handling
    function initMobileTooltips() {
        if (window.innerWidth <= 768) {
            const skillItems = document.querySelectorAll('.skill-item');
            
            skillItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close any other open tooltips
                    skillItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current tooltip
                    this.classList.toggle('active');
                });
            });
            
            // Close tooltip when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.skill-item')) {
                    skillItems.forEach(item => {
                        item.classList.remove('active');
                    });
                }
            });
            
            // Close tooltip when tapping the tooltip itself (mobile behavior)
            document.addEventListener('click', function(e) {
                if (e.target.closest('.skill-tooltip')) {
                    const skillItem = e.target.closest('.skill-item');
                    if (skillItem) {
                        skillItem.classList.remove('active');
                    }
                }
            });
        }
    }
    
    // Initialize mobile tooltips
    initMobileTooltips();
    
    // Reinitialize on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Remove all active states first
            document.querySelectorAll('.skill-item').forEach(item => {
                item.classList.remove('active');
            });
            // Reinitialize for new screen size
            initMobileTooltips();
        }, 250);
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        // Close all tooltips on orientation change
        setTimeout(() => {
            document.querySelectorAll('.skill-item').forEach(item => {
                item.classList.remove('active');
            });
        }, 100);
    });
});

// Performance optimization: Pause animations when tab is not visible

  // Performance optimization: Pause animations when tab is not visible
});

