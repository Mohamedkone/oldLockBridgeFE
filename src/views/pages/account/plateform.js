export const platforms = {
    gdrive: {
        name: "Google Drive",
        inputs: { oauth: true },
        bkc: "darkred",
        color: "white",
        caption: "Require OAuth",
        available:true
    },
    dropbox: {
        name: "Dropbox",
        inputs: { oauth: true },
        bkc: "darkblue",
        color: "white",
        caption: "Require OAuth",
        available:true
    },
    s3Compatible: {
        name: "S3 Compatible",
        inputs: {
        keys: ["Endpoint URL", "Access Key ID", "Secret Access Key", "Bucket Name", "Region"],
        signedUrl: ["Signed URL"],
        },
        bkc: "darkgreen",
        color: "white",
        caption: "Manual Setup",
        available:true
    },
    aws: {
        name: "AWS",
        inputs: {
        keys: ["Access Key ID", "Secret Access Key", "Bucket Name", "Region"],
        signedUrl: ["Signed URL"],
        },
        bkc: "coral",
        color: "white",
        caption: "Manual Setup",
        available:false
    },
    azure: {
        name: "Azure",
        inputs: {
        keys: ["Account Name", "Account Key", "Container Name"],
        },
        bkc: "darkcyan",
        color: "white",
        caption: "Manual Setup",
        available:false
    },
    gcp: {
        name: "GCP Cloud",
        inputs: {
        keys: ["Project ID", "Service Account JSON"],
        },
        bkc: "brown",
        color: "white",
        caption: "Manual Setup",
        available:false
    },
    onedrive: {
        name: "OneDrive",
        inputs: { oauth: true },
        bkc: "cadetblue",
        color: "white",
        caption: "Require OAuth",
        available:false
    },
    };