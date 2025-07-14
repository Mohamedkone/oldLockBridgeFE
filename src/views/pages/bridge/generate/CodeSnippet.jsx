import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Check } from "@mui/icons-material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";


const CodeSnippet = ({
    scriptCont,
    header,
    onSucess,
    onError,
    uUrl,
    passphrase,
    sse,
    cse,
    origin,
    darkMode,
    setMyScript
}) => {

    const [copied, setCopied] = useState(false)
    const codeString = `
    <script>
        (function() {
            var script = document.createElement('script');
            script.src = '';
            script.async = true;
            script.onload = function() {
                FileUploader.init({
                    target: "${scriptCont}",
                    uploadUrl: "${uUrl}",
                    passphrase: ${passphrase},
                    serverSideEnc: ${sse},
                    clientSideEnc: ${cse},
                    origin: "${origin}",
                    darkmode: ${darkMode},
                    headers: {${header}},
                    onSuccess: (data) => {
                        ${onSucess}
                    },
                    onError: (error) => {
                        ${onError}
                    }
                });
            };
            document.body.appendChild(script);
        })();
    </script>
    `;

    useEffect(()=>{
        setMyScript(codeString)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[codeString])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeString);
        setCopied(()=>true)
        setTimeout(()=>{
            setCopied(()=>false)
        },3000)
    };

    return (
        <Box
        sx={{
            bgcolor: "#172338",
            color: "#c5c5c5",
            p: 2,
            borderRadius: 2,
            fontFamily: "monospace",
            position: "relative",
            maxWidth: "100%",
            maxHeight:"500px",
            overflowX: "auto",
        }}
        >
        <Tooltip
            title="Copy to Clipboard" 
            placement="top"
        >
            {copied
            ?
                <Box 
                    display={'flex'} 
                    alignItems={'center'}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "#fff",
                    }}
                >
                    <Check />
                    <Typography>
                        Copied
                    </Typography>
                </Box>
                :
                <Button
                onClick={copyToClipboard}
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "#fff",
                }}
                startIcon={<ContentCopyIcon />}
                >
                Copy
                </Button>
            }
        </Tooltip>
        <Box component="pre" sx={{ whiteSpace: "pre-wrap" }}>
            <SyntaxHighlighter language="javascript" style={dracula}>
                {codeString}
            </SyntaxHighlighter>
        </Box>
        </Box>
    );
};

export default CodeSnippet;
