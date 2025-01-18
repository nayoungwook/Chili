
const CONTENT
    = "<title> This is <bold> Title! </bold></title>\n";

class Token {
    constructor(type, text) {
        this.type = type;
        this.text = text;
    }
}

function tokenize(content) {
    let i = 0;
    let token = "";
    let result = [];
    let isEndTag = false;

    for (; i < content.length; i++) {
        let c = content[i];

        if (c == '<') {
            if (token != "") {
                result.push(new Token('text', token));
                token = "";
            }
            isEndTag = content[i + 1] == '/';
        }

        if (c == '>') {
            token += c;
            if (isEndTag)
                result.push(new Token('endTag', token));
            else
                result.push(new Token('tag', token));
            token = "";
            continue;
        }

        token += c;
    }

    return result;
}

class Tag {
    constructor(type, contents) {
        this.type = type;
        this.contents = contents;
    }
}

function parse(tokens) {
    let i = 0;
    let result = [];

    for (; i < tokens.length; i++) {
        let tkn = tokens[i];

        if (tkn.type == "tag") {
            let tknCnt = 1;
            let contents = [];
            let tagType = tkn.text;

            while (tknCnt != 0) {
                i++;
                tkn = tokens[i];

                if (tkn.type == "tag")
                    tknCnt++;
                else if (tkn.type == "endTag")
                    tknCnt--;
                if (tknCnt == 0) break;

                contents.push(tkn);
            }

            result.push(new Tag(tagType, parse(contents)));
        } else {
            result.push(new Tag("text", tkn));
        }
    }
    return result;
}

let result = parse(tokenize(CONTENT));

console.log(result);
