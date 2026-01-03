class Storage {
    constructor() {
        this.dbName = 'diary_entries';
    }

    // Save an entry
    saveEntry(date, data) {
        if (!date) return { success: false, error: 'Date is required' };
        
        try {
            const entries = this.getEntries();
            entries[date] = data;
            localStorage.setItem(this.dbName, JSON.stringify(entries));
            return { success: true };
        } catch (e) {
            console.error("Save failed", e);
            return { success: false, error: e.message };
        }
    }

    // Get all entries
    getEntries() {
        const entriesStr = localStorage.getItem(this.dbName);
        return entriesStr ? JSON.parse(entriesStr) : {};
    }

    // Get single entry
    getEntry(date) {
        const entries = this.getEntries();
        return entries[date] || null;
    }

    // Delete entry
    deleteEntry(date) {
        const entries = this.getEntries();
        if (entries[date]) {
            delete entries[date];
            localStorage.setItem(this.dbName, JSON.stringify(entries));
            return true;
        }
        return false;
    }

    // Check if entry exists
    hasEntry(date) {
        const entries = this.getEntries();
        return !!entries[date];
    }

    // Clear all data (Dangerous)
    clearAll() {
        localStorage.removeItem(this.dbName);
    }

    // Export single entry as JSON matching the strict output.json structure
    exportEntry(date) {
        const entry = this.getEntry(date);
        if (!entry) return null;

        // Ensure structure matches output.json exactly
        // We assume 'entry' object is already built with this structure by the UI
        // But for safety, we can re-construct or validator here.
        // For now, we'll return it directly as we'll enforce structure in UI.js
        
        // However, let's map it to be safe if we change internal storage structure later.
        // The prompt asks to "output file same @[output.json]".
        
        return JSON.stringify(entry, null, 2);
    }
    
    // Import from JSON file content
    importEntries(jsonContent) {
       try {
           const data = JSON.parse(jsonContent);
           /* 
               Handle two cases:
               1. Array of entries (Backup)
               2. Single entry object
           */
           
           let count = 0;
           
           if (Array.isArray(data)) {
               // Backup format? Or list of entries?
               // Let's assume backup is an object { "YYYY-MM-DD": {...}, ... } or array
               // If it's the requested output format, it has a "date" field.
               
               data.forEach(item => {
                   if (item.date) {
                       this.saveEntry(item.date, item);
                       count++;
                   }
               });
           } else {
               // Single object
               // Check if it's our direct backup format (Map) VS single entry
                if (data.date && data.version) {
                     // Single Output.json format
                     this.saveEntry(data.date, data);
                     count = 1;
                } else {
                    // Maybe it's a bulk backup object keyed by date
                    Object.keys(data).forEach(dateKey => {
                        // Simple validation
                        if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            this.saveEntry(dateKey, data[dateKey]);
                            count++;
                        }
                    });
                }
           }
           
           return { success: true, count };
       } catch(e) {
           return { success: false, error: e.message };
       }
    }

    // Download file helper
    downloadJSON(filename, content) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
