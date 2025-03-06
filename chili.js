
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

        if (c == '[') {
            if (token != "") {
                result.push(new Token('text', token));
                token = "";
            }
            isEndTag = content[i + 1] == '/';
        }

        if (c == ']') {
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

    if (token != '')
        result.push(new Token('text', token));

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

function generateBlog(tags) {
    let result = '';
    let container = document.body.querySelector('#container');

    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];

        if (tag.type == "[title]") {
            container.querySelector('#title').innerHTML = generateBlog(tag.contents);
        }

        if (tag.type == "[bold]") {
            result += '<b style="font-weight:1000;"> ' + generateBlog(tag.contents) + ' </b>';
        }

        if (tag.type == "[date]") {
            container.querySelector('#date').innerHTML = `<em>작성일: ${generateBlog(tag.contents)}</em>`;
        }

        if (tag.type == "text") {
            result += tag.contents.text;
        }
    }

    return result;
}

function applyBlog(CONTENT) {
    let tokens = tokenize(CONTENT);
    let result = parse(tokens);

    let container = document.body.querySelector('#container');
    let blog = generateBlog(result);
    container.innerHTML += blog;
}

const CONTENT
    = "[title] This is [bold] Title! [/bold][/title]\n [date] 2025-03-06 [/date] and this is content";

applyBlog(CONTENT);