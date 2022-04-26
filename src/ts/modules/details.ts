// Based on https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
export const detailsEls = new WeakMap<HTMLDetailsElement, DetailsComponent>();
export class DetailsComponent {
    el: HTMLDetailsElement;
    summary: HTMLElement;
    content: HTMLDivElement;
    anchors: HTMLAnchorElement[];
    animation: Animation;
    isClosing: boolean;
    isExpanding: boolean;
    constructor(el: Element) {
        // Store the <details> element
        this.el = el as HTMLDetailsElement;
        // Store the <summary> element
        this.summary = el.querySelector("summary");
        // Store the <div class="content"> element
        this.content = el.querySelector(".content");
        this.anchors = Array.from(this.summary?.querySelectorAll("a"));

        // Store the animation object (so we can cancel it if needed)
        this.animation = null;
        // Store if the element is closing
        this.isClosing = false;
        // Store if the element is expanding
        this.isExpanding = false;
        // Detect user clicks on the summary element
        this.onClick = this.onClick.bind(this);
        this.anchorClick = this.anchorClick.bind(this);

        this.summary?.addEventListener("click", this.onClick);
        this.anchors?.forEach(anchor => {
            anchor?.addEventListener("click", this.anchorClick);
        });
    }

    anchorClick(e: MouseEvent) {
        e.stopPropagation();
    }

    onClick(e: MouseEvent) {
        // Stop default behaviour from the browser
        e.preventDefault(); 

        this.toggle();
    }

    toggle() {
        // Add an overflow on the <details> to avoid content overflowing
        this.el.style.overflow = "hidden";

        // Check if the element is being closed or is already closed
        if (this.isClosing || !this.el.open) 
            this.open();

        // Check if the element is being openned or is already open
        else if (this.isExpanding || this.el.open) 
            this.shrink();
    }

    shrink() {
        // Set the element as "being closed"
        this.isClosing = true;

        // Store the current height of the element
        const start = this.el.offsetHeight;

        // Calculate the height of the summary
        const end = this.summary.offsetHeight;

        const startHeight = `${start}px`;
        const endHeight = `${end}px`;

        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }

        // Start a WAAPI animation
        this.animation = this.el.animate(
            {
                // Set the keyframes from the startHeight to endHeight
                height: [startHeight, endHeight],
            },
            {
                duration: 500,
                easing: "ease-out",
            }
        );

        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(false);
        // If the animation is cancelled, isClosing variable is set to false
        this.animation.oncancel = () => (this.isClosing = false);
    }

    open() {
        // Apply a fixed height on the element
        this.el.style.height = `${this.el.offsetHeight}px`;

        // Force the [open] attribute on the details element
        this.el.open = true;

        // Wait for the next frame to call the expand function
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        // Set the element as "being expanding"
        this.isExpanding = true;

        // Get the current fixed height of the element
        const start = this.el.offsetHeight;

        // Calculate the open height of the element (summary height + content height)
        const end = this.summary.offsetHeight + this.content.offsetHeight;

        const startHeight = `${start}px`;
        const endHeight = `${end}px`;

        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }

        // Start a WAAPI animation
        this.animation = this.el.animate(
            {
                // Set the keyframes from the startHeight to endHeight
                height: [startHeight, endHeight],
            },
            {
                duration: 500,
                easing: "ease-out",
            }
        );
        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(true);
        // If the animation is cancelled, isExpanding variable is set to false
        this.animation.oncancel = () => (this.isExpanding = false);
    }

    onAnimationFinish(open) {
        // Set the open attribute based on the parameter
        this.el.open = open;
        // Clear the stored animation
        this.animation = null;
        // Reset isClosing & isExpanding
        this.isClosing = false;
        this.isExpanding = false;
        // Remove the overflow hidden and the fixed height
        this.el.style.height = this.el.style.overflow = "";
    }

    stop() {
        if (this.el) {
            detailsEls.delete(this.el);
            this.summary?.removeEventListener?.("click", this.onClick);
            this.anchors?.forEach(anchor => {
                anchor?.removeEventListener?.("click", this.anchorClick);
            });
            
            this.animation?.cancel?.();

            this.el = null;
            this.summary = null;
            this.content = null;
            this.anchors = null;

            this.animation = null;
            this.isClosing = null;
            this.isExpanding = null;
        }
    }
}

export const run = () => {
    let details = Array.from(document.querySelectorAll("details"));
    if (details.length > 0) {
        details.forEach((el) => {
            if (el && !detailsEls.has(el)) 
                detailsEls.set(el, new DetailsComponent(el));
        });
    }
}
        
export const hashChange = () => {
    let { hash } = document.location;
    let el = document.querySelector(`details${hash}`) as HTMLDetailsElement;
    
    if (el && hash.length) {
        if (el.open != true) {
            let detailsComponent = detailsEls.get(el);
            detailsComponent?.toggle();
        }
    }
};

window.addEventListener("load", hashChange);
window.addEventListener('hashchange', hashChange);