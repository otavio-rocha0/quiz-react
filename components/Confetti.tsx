import React, { useRef, useEffect, useCallback } from 'react';

interface ConfettiProps {
    active: boolean;
}

const PARTICLE_COUNT = 200;
const COLORS = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#9C27B0', '#FFFFFF'];

interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    rotation: number;
    speed: number;
    angle: number;
    tilt: number;
    tiltAngle: number;
    tiltAngleSpeed: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrameId = useRef<number | null>(null);

    const createParticles = useCallback(() => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            newParticles.push({
                x: window.innerWidth * 0.5,
                y: -20,
                w: 10 + Math.random() * 10,
                h: 5 + Math.random() * 5,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * 360,
                speed: 3 + Math.random() * 4,
                angle: -Math.PI / 2 + (Math.random() * 0.4 - 0.2),
                tilt: Math.random() * 10,
                tiltAngle: 0,
                tiltAngleSpeed: 0.05 + Math.random() * 0.05,
            });
        }
        particles.current = newParticles;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.current.forEach((p, index) => {
            ctx.save();
            ctx.translate(p.x + p.tilt, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            // Update particle
            p.y += p.speed * Math.sin(p.angle);
            p.x += p.speed * Math.cos(p.angle);
            p.speed *= 0.99; // friction
            p.y += 1.5; // gravity
            p.rotation += p.speed * 0.5;
            p.tiltAngle += p.tiltAngleSpeed;
            p.tilt = Math.sin(p.tiltAngle) * 15;
            
            if (p.y > canvas.height) {
                particles.current.splice(index, 1);
            }
        });

        if (particles.current.length > 0) {
            animationFrameId.current = requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        if (active) {
            createParticles();
            animationFrameId.current = requestAnimationFrame(draw);
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [active, createParticles, draw]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
        />
    );
};

export default Confetti;
