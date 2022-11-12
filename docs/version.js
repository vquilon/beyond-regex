const SW_VERSION = '0.0.alpha';
const SW_BUILD = '20';

if (typeof window !== "undefined") {
    window.SW_VERSION = SW_VERSION;
    window.SW_BUILD = SW_BUILD;
}