import * as notifier from 'node-notifier';
import NotificationCenter = require('node-notifier/notifiers/notificationcenter');
import WindowsToaster = require('node-notifier/notifiers/toaster');
import WindowsBalloon = require('node-notifier/notifiers/balloon');
import NotifySend = require('node-notifier/notifiers/notifysend');
import Growl = require('node-notifier/notifiers/growl');

export function notify(notification?: NotificationCenter.Notification): Promise<NotificationCenter>;
export function notify(notification?: WindowsToaster.Notification): Promise<WindowsToaster>;
export function notify(notification?: WindowsBalloon.Notification): Promise<WindowsBalloon>;
export function notify(notification?: NotifySend.Notification): Promise<NotifySend>;
export function notify(notification?: Growl.Notification): Promise<Growl>;
export function notify(notification?: WindowsToaster.Notification): Promise<notifier.NodeNotifier>;
export function notify(notification?: string): Promise<notifier.NodeNotifier>;
export function notify(notification?: any) {
    return new Promise((resolve, reject) =>
        notifier.notify(
            typeof notification === 'object' ? { ...notification, wait: true } : notification,
            (err, response) => (err ? reject(err) : resolve(response)),
        ),
    );
}
