import { Service } from "@okikio/native";

export class Navbar extends Service {
    public navbar: HTMLElement;
    public elements: HTMLElement[];
    public menu: HTMLElement;
    public collapseSection: HTMLElement;
    public navbarList: HTMLElement;
    public toggleStatus: boolean;
    public mobileEls: HTMLElement[];

    public init() {
        // Elements
        this.navbar = document.querySelector(".navbar") as HTMLElement;
        this.collapseSection = this.navbar.querySelector(".navbar-collapse.mobile") as HTMLElement;
        this.navbarList = this.navbar.querySelector(".navbar-list") as HTMLElement;
        this.mobileEls = Array.from(this.collapseSection.querySelectorAll(".navbar-list a"));
        this.elements = Array.from(this.navbar.querySelectorAll(".navbar-list a"));
        this.menu = this.navbar.querySelector(".navbar-toggle") as HTMLElement;
        this.toggleStatus = false;

        this.fixTabindex();
        this.toggleClick = this.toggleClick.bind(this);
    }

    public activateLink() {
        let { href } = window.location;

        for (let el of this.elements) {
            let itemHref =
                el.getAttribute("data-path") ||
                (el as HTMLAnchorElement).href;
            if (!itemHref || itemHref.length < 1) return;

            let URLmatch = new RegExp(itemHref).test(href);
            let isActive = el.classList.contains("active");
            if (!(URLmatch && isActive)) {
                el.classList.toggle("active", URLmatch);
            }
        }

        if (this.toggleStatus) {
            this.toggleClick();
        }
    }

    public fixTabindex() {
        for (let el of this.mobileEls) {
            el.setAttribute("tabindex", `${this.toggleStatus ? 0 : -1}`);
            // el.style.setProperty("visibility", `${this.toggleStatus ? "visible" : "hidden"}`);
        }
    }

    public toggleClick() {
        this.collapseSection.style?.setProperty?.("--height", `${this.navbarList.clientHeight}px`);
        this.toggleStatus = !this.toggleStatus;
        this.collapseSection.classList.toggle("collapse", !this.toggleStatus);
        this.collapseSection.classList.toggle("show", this.toggleStatus);
        this.fixTabindex();
    }

    public scroll() {
        this.navbar.classList.toggle("active-shadow", window.scrollY >= 5);
    }

    public initEvents() {
        this.menu.addEventListener("click", this.toggleClick);
        this.emitter.on("scroll", this.scroll, this);
        this.emitter.on("READY", this.activateLink, this);
        this.emitter.on("GO", this.activateLink, this);
    }

    public stopEvents() {
        this.navbar.removeEventListener("click", this.toggleClick);
        this.emitter.off("scroll", this.scroll, this);
        this.emitter.off("READY", this.activateLink, this);
        this.emitter.off("GO", this.activateLink, this);
    }

    public uninstall() {
        while (this.elements.length) this.elements.pop();
        this.elements = null;
        this.menu = null;
        this.navbar = null;
    }
}