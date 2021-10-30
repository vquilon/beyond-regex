// This code sample uses features introduced in Workbox v6.
import { Workbox } from 'https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-window.prod.mjs';

if ('serviceWorker' in navigator) {
    function createUIPrompt(opts) {
        Swal.fire({
            title: 'New version available!',
            text: "A new update is available. Do you want to update now?",
            icon: 'info',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                opts.onAccept();
                Swal.fire(
                    'Updated',
                    'Beyond Regex will be updated.',
                    'success'
                )
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                const showCancelInfo = async () => {
                    const swVersion = await wb.messageSW({ type: 'GET_VERSION' });
                    Swal.fire(
                        'Cancelled',
                        `Your Beyond Regex version is ${swVersion}.`,
                        'info'
                    )
                }
                showCancelInfo();

            }
        })
    }
    let actual_url = location.href;
    if (actual_url.lastIndexOf("index.html") !== -1) {
        actual_url = actual_url.slice(0, actual_url.length - "index.html".length)
    }
    const wb = new Workbox(`${actual_url}sw_ga.js`);
    let registration;

    // wb.addEventListener('activated', (event) => {
    //   if (!event.isUpdate) {
    //     console.log('Service worker activated for the first time!');

    //     // If your service worker is configured to precache assets, those
    //     // assets should all be available now.
    //   }

    //   // Get the current page URL + all resources the page loaded.
    //   const urlsToCache = [
    //     location.href,
    //     ...performance.getEntriesByType('resource').map((r) => r.name),
    //   ];
    //   // Send that list of URLs to your router in the service worker.
    //   wb.messageSW({
    //     type: 'CACHE_URLS',
    //     payload: { urlsToCache },
    //   });
    // });

    const showSkipWaitingPrompt = (event) => {
        console.log(`A new service worker has installed, but it can't activate` +
            `until all tabs running the current version have fully unloaded.`);
        // `event.wasWaitingBeforeRegister` will be false if this is
        // the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously
        // updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.

        // Assumes your app has some sort of prompt UI element
        // that a user can either accept or reject.
        const prompt = createUIPrompt({
            onAccept: () => {
                // Assuming the user accepted the update, set up a listener
                // that will reload the page as soon as the previously waiting
                // service worker has taken control.
                wb.addEventListener('controlling', (event) => {
                    window.location.reload();
                });

                wb.messageSkipWaiting();
            },

            onReject: () => {
                prompt.dismiss();
            }
        });
    };
    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener('waiting', showSkipWaitingPrompt);

    wb.register().then(
        registration => {
            console.log(`Service Worker with Google Analytics registered! Scope: ${registration.scope}`);
        },
        error => {
            console.error(`Service Worker with Google Analytics registration failed: ${error}`);
        },
    );

    const message = async () => {
        const swVersion = await wb.messageSW({ type: 'GET_VERSION' });
        console.log('Service Worker version:', swVersion);
    }

    message();
}