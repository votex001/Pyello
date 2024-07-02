import { useRef, useState } from 'react';

const useScrollByGrab = () => {
    const scrollContainerRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        const scrollContainer = scrollContainerRef.current;
        const firstLevelChild = Array.from(scrollContainer.children).some(child => child.contains(e.target) && !Array.from(child.children).some(grandchild => grandchild.contains(e.target)));

        // Prevent scrolling if the target element is a child of scrollContainer
        // if (e.target !== scrollContainer) return;
        if (!firstLevelChild && e.target !== scrollContainer) return;

        setIsDown(true);
        setStartX(e.pageX - scrollContainer.offsetLeft);
        setScrollLeft(scrollContainer.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDown(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const scrollContainer = scrollContainerRef.current;
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) ; // The * 3 is to speed up the scroll
        scrollContainer.scrollLeft = scrollLeft - walk;
    };

    return {
        scrollContainerRef,
        handleMouseDown,
        handleMouseLeave,
        handleMouseUp,
        handleMouseMove
    };
};

export default useScrollByGrab;
