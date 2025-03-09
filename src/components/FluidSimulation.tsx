"use client"
import { useEffect, useRef, useState } from "react"
import SPHSimulation from "@/Fluid/SPHSimulation"
import Vector2 from '@/Fluid/Vector2';

export default function FluidSimulation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [simulation, setSimulation] = useState<SPHSimulation | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    let particleImageData: ImageData | null = null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Définir la largeur et la hauteur du canvas
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        // Créer une instance de SPHSimulation avec le canvas
        const sim = new SPHSimulation();
        sim.canvas = canvas; // Passer le canvas à la simulation
        setSimulation(sim);
        
        // Fonction d'animation
        const animate = (() => {
            let lastTime = 0;
            const targetFPS = 60; // Taux de rafraîchissement cible
            const frameInterval = 1000 / targetFPS;
        
            return (timestamp: number) => {
                if (!canvas || !ctx || !sim) return;
                
                const elapsed = timestamp - lastTime;
                if (elapsed > frameInterval) { // N'exécuter que si assez de temps s'est écoulé
                    lastTime = timestamp - (elapsed % frameInterval);
                    
                    // Effacer le canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Mettre à jour et dessiner la simulation
                    const dt = Math.min(0.3, elapsed / 100); // Limiter dt à une valeur raisonnable
                    sim.update(dt);
                    
                    // Dessiner les particules avec une méthode optimisée
                    const drawParticles = () => {
                        // Pré-allocation d'un buffer d'image si nécessaire
                        if (!particleImageData) {
                            particleImageData = ctx.createImageData(canvas.width, canvas.height);
                        }
                        
                        // Effacer le buffer d'image
                        const data = particleImageData.data;
                        data.fill(0);
                        
                        // Dessiner chaque particule dans le buffer
                        for (const particle of sim.particles) {
                            const x = Math.floor(particle.position.x);
                            const y = Math.floor(particle.position.y);
                            
                            // Vérifier que la particule est dans les limites du canvas
                            if (x >= 1 && x < canvas.width - 1 && y >= 1 && y < canvas.height - 1) {
                                const index = (y * canvas.width + x) * 4;
                                data[index] = 255;     // R
                                data[index + 1] = 112; // G
                                data[index + 2] = 112; // B
                                data[index + 3] = 255; // A
                            }
                        }
                        
                        // Appliquer le buffer d'image au canvas
                        ctx.putImageData(particleImageData, 0, 0);
                    };

                    drawParticles();
                }
                
                // Continuer l'animation
                animationFrameRef.current = requestAnimationFrame(animate);
            };
        })();
        
        // Démarrer l'animation
        animationFrameRef.current = requestAnimationFrame(animate);
        
        // Ajouter des gestionnaires d'événements pour la souris
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                sim.leftMouseDown = true;
            } else if (e.button === 2) {
                sim.rightMouseDown = true;
            }
            const rect = canvas.getBoundingClientRect();
            sim.mousePosition = new Vector2(
                e.clientX - rect.left,
                e.clientY - rect.top
            );
        };
        
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 0) {
                sim.leftMouseDown = false;
            } else if (e.button === 2) {
                sim.rightMouseDown = false;
            }
        };
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            sim.mousePosition = new Vector2(
                e.clientX - rect.left,
                e.clientY - rect.top
            );
            
            // Vérifier si la souris est dans les limites du canvas
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Mise à jour du flag pour indiquer si la souris est dans le canvas
            sim.mouseInCanvas = (
                x >= 0 && 
                x < canvas.width && 
                y >= 0 && 
                y < canvas.height
            );
        };

        const handleMouseEnter = (e: MouseEvent) => {
            sim.mouseInCanvas = true;
        };

        const handleMouseLeave = (e: MouseEvent) => {
            sim.mouseInCanvas = false;
        };
        
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault(); // Empêcher le menu contextuel
        };
        
        canvas.addEventListener('mouseenter', handleMouseEnter);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('contextmenu', handleContextMenu);
        
        // Nettoyage
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            canvas.removeEventListener('mouseenter', handleMouseEnter);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            id="fluidCanvas" 
            className="border-2  fluid  h-1/2 w-1/2 absolute"
        >
        </canvas>
    );
}