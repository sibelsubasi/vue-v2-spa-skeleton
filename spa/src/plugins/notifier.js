export default {

    data: {},
    changed: false,

    put(id, type, icon, caption, subcaption, text, progress, action, removeOnClick) {
        // console.log(`push notifier data: ${id}, ${type}, ${caption}`);

        var changed = true;
        if (this.data[id]) {
            if (this.data[id].type == type) {
                changed = false;
            }
        }

        this.data[id] = {
            id: id,
            type: type,
            icon: icon,
            caption: caption,
            subcaption: subcaption,
            progress: progress,
            text: text,
            action: action,
            removeOnClick: removeOnClick,
        }
        this.changed = changed;
    },

    putProgress(id, icon, caption, subcaption, text, progress, action, removeOnClick) {
        return this.put(id, 'progress', icon, caption, subcaption, text, progress, action, removeOnClick);
    },

    putSuccess(id, icon, caption, subcaption, text, action, removeOnClick) {
        return this.put(id, 'success', icon, caption,subcaption, text, 0, action, removeOnClick);
    },
    putError(id, icon, caption, subcaption, text, action, removeOnClick) {
        return this.put(id, 'error', icon, caption,subcaption, text, 0, action, removeOnClick);
    },

    remove(id,notify) {
        delete this.data[id];
        if (notify) {
            this.changed = true;
        }
    },

    get(id) {
        return this.data[id];
    },

    getAll() {
        return this.data;
    },

    clearChangeStatus() {
        this.changed = false;
    }
}
