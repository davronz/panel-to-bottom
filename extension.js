import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class PanelToBottomExtension {
    constructor() {
        this._originalUpdateBoxes = null;
    }

    enable() {
        // Get reference to the layout manager
        const layoutManager = Main.layoutManager;
        
        // Store the original _updateBoxes method
        this._originalUpdateBoxes = layoutManager._updateBoxes;
        
        // Override _updateBoxes to reposition panel after normal setup
        layoutManager._updateBoxes = function() {
            // Call the original method first to set up everything normally
            this._originalUpdateBoxes.call(this);
            
            // Now reposition the panel box to the bottom
            const panelBox = this.panelBox;
            const monitor = this.primaryMonitor;
            
            if (panelBox && monitor) {
                // Move panel to bottom: monitor.y + monitor.height - panel.height
                panelBox.set_position(monitor.x, monitor.y + monitor.height - panelBox.height);
            }
        }.bind(layoutManager);
        
        // Store reference for cleanup
        layoutManager._originalUpdateBoxes = this._originalUpdateBoxes;
        
        // Trigger initial layout update
        layoutManager._updateBoxes();
    }

    disable() {
        const layoutManager = Main.layoutManager;
        
        // Restore the original _updateBoxes method
        if (this._originalUpdateBoxes) {
            layoutManager._updateBoxes = this._originalUpdateBoxes;
            this._originalUpdateBoxes = null;
        }
        
        // Restore panel to original top position
        layoutManager._updateBoxes();
    }
}