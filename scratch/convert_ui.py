import re
import sys

def convert_to_jsx(content):
    # Remove IIFE
    content = re.sub(r'\(function\s*\(\)\s*\{', '', content, 1)
    content = re.sub(r'\}\)\(\);\s*$', '', content)
    content = content.replace('"use strict";', '')
    
    # Replace html`...` with (...)
    content = re.sub(r'html`', '(', content)
    content = re.sub(r'`', ')', content)
    
    # Replace ${...} with {...}
    content = re.sub(r'\$\{([^}]+)\}', r'{\1}', content)
    
    # Replace class= with className=
    content = content.replace('class=', 'className=')
    content = content.replace('stroke-width=', 'strokeWidth=')
    content = content.replace('stroke-linecap=', 'strokeLinecap=')
    content = content.replace('stroke-linejoin=', 'strokeLinejoin=')
    content = content.replace('fill-rule=', 'fillRule=')
    content = content.replace('clip-rule=', 'clipRule=')
    
    # Exports
    content = content.replace('window.UI = {', 'export const UI = {')
    content = content.replace('window.Store = {', 'export const Store = {')
    
    # Replace variable declarations with const/let
    content = re.sub(r'\bvar\b', 'const', content)
    
    # Remove window. assignments
    content = re.sub(r'const html = window\.html.*?;', '', content)
    content = re.sub(r'const Icons = window\.Icons.*?;', 'import { Icons } from "./Icons";\nimport { Glyphs, Motifs } from "./Graphics";', content)
    
    return "import React, { useState, useEffect } from 'react';\n" + content

with open(sys.argv[1], 'r', encoding='utf-8') as f:
    code = f.read()

with open(sys.argv[2], 'w', encoding='utf-8') as f:
    f.write(convert_to_jsx(code))
