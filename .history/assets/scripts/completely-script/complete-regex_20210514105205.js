var colors = ["almond",
    "antique brass",
    "apricot",
    "aquamarine",
    "asparagus",
    "atomic tangerine",
    "banana mania",
    "beaver",
    "bittersweet",
    "black",
    "blizzard blue",
    "blue",
    "blue bell",
    "blue gray",
    "blue green",
    "blue violet",
    "blush",
    "brick red",
    "brown",
    "burnt orange",
    "burnt sienna",
    "cadet blue",
    "canary",
    "caribbean green",
    "carnation pink",
    "cerise",
    "cerulean",
    "chestnut",
    "copper",
    "cornflower",
    "cotton candy",
    "dandelion",
    "denim",
    "desert sand",
    "eggplant",
    "electric lime",
    "fern",
    "forest green",
    "fuchsia",
    "fuzzy wuzzy",
    "gold",
    "goldenrod",
    "granny smith apple",
    "gray",
    "green",
    "green blue",
    "green yellow",
    "hot magenta",
    "inchworm",
    "indigo",
    "jazzberry jam",
    "jungle green",
    "laser lemon",
    "lavender",
    "lemon yellow",
    "macaroni and cheese",
    "magenta",
    "magic mint",
    "mahogany",
    "maize",
    "manatee",
    "mango tango",
    "maroon",
    "mauvelous",
    "melon",
    "midnight blue",
    "mountain meadow",
    "mulberry",
    "navy blue",
    "neon carrot",
    "olive green",
    "orange",
    "orange red",
    "orange yellow",
    "orchid",
    "outer space",
    "outrageous orange",
    "pacific blue",
    "peach",
    "periwinkle",
    "piggy pink",
    "pine green",
    "pink flamingo",
    "pink sherbet",
    "plum",
    "purple heart",
    "purple mountain's majesty",
    "purple pizzazz",
    "radical red",
    "raw sienna",
    "raw umber",
    "razzle dazzle rose",
    "razzmatazz",
    "red",
    "red orange",
    "red violet",
    "robin's egg blue",
    "royal purple",
    "salmon",
    "scarlet",
    "screamin' green",
    "sea green",
    "sepia",
    "shadow",
    "shamrock",
    "shocking pink",
    "silver",
    "sky blue",
    "spring green",
    "sunglow",
    "sunset orange",
    "tan",
    "teal blue",
    "thistle",
    "tickle me pink",
    "timberwolf",
    "tropical rain forest",
    "tumbleweed",
    "turquoise blue",
    "unmellow yellow",
    "violet (purple)",
    "violet blue",
    "violet red",
    "vivid tangerine",
    "vivid violet",
    "white",
    "wild blue yonder",
    "wild strawberry",
    "wild watermelon",
    "wisteria",
    "yellow",
    "yellow green",
    "yellow orange"
];

var c2h = {
    "almond": "#EFDECD",
    "antique brass": "#CD9575",
    "apricot": "#FDD9B5",
    "aquamarine": "#78DBE2",
    "asparagus": "#87A96B",
    "atomic tangerine": "#FFA474",
    "banana mania": "#FAE7B5",
    "beaver": "#9F8170",
    "bittersweet": "#FD7C6E",
    "black": "#000000",
    "blizzard blue": "#ACE5EE",
    "blue": "#1F75FE",
    "blue bell": "#A2A2D0",
    "blue gray": "#6699CC",
    "blue green": "#0D98BA",
    "blue violet": "#7366BD",
    "blush": "#DE5D83",
    "brick red": "#CB4154",
    "brown": "#B4674D",
    "burnt orange": "#FF7F49",
    "burnt sienna": "#EA7E5D",
    "cadet blue": "#B0B7C6",
    "canary": "#FFFF99",
    "caribbean green": "#1CD3A2",
    "carnation pink": "#FFAACC",
    "cerise": "#DD4492",
    "cerulean": "#1DACD6",
    "chestnut": "#BC5D58",
    "copper": "#DD9475",
    "cornflower": "#9ACEEB",
    "cotton candy": "#FFBCD9",
    "dandelion": "#FDDB6D",
    "denim": "#2B6CC4",
    "desert sand": "#EFCDB8",
    "eggplant": "#6E5160",
    "electric lime": "#CEFF1D",
    "fern": "#71BC78",
    "forest green": "#6DAE81",
    "fuchsia": "#C364C5",
    "fuzzy wuzzy": "#CC6666",
    "gold": "#E7C697",
    "goldenrod": "#FCD975",
    "granny smith apple": "#A8E4A0",
    "gray": "#95918C",
    "green": "#1CAC78",
    "green blue": "#1164B4",
    "green yellow": "#F0E891",
    "hot magenta": "#FF1DCE",
    "inchworm": "#B2EC5D",
    "indigo": "#5D76CB",
    "jazzberry jam": "#CA3767",
    "jungle green": "#3BB08F",
    "laser lemon": "#FEFE22",
    "lavender": "#FCB4D5",
    "lemon yellow": "#FFF44F",
    "macaroni and cheese": "#FFBD88",
    "magenta": "#F664AF",
    "magic mint": "#AAF0D1",
    "mahogany": "#CD4A4C",
    "maize": "#EDD19C",
    "manatee": "#979AAA",
    "mango tango": "#FF8243",
    "maroon": "#C8385A",
    "mauvelous": "#EF98AA",
    "melon": "#FDBCB4",
    "midnight blue": "#1A4876",
    "mountain meadow": "#30BA8F",
    "mulberry": "#C54B8C",
    "navy blue": "#1974D2",
    "neon carrot": "#FFA343",
    "olive green": "#BAB86C",
    "orange": "#FF7538",
    "orange red": "#FF2B2B",
    "orange yellow": "#F8D568",
    "orchid": "#E6A8D7",
    "outer space": "#414A4C",
    "outrageous orange": "#FF6E4A",
    "pacific blue": "#1CA9C9",
    "peach": "#FFCFAB",
    "periwinkle": "#C5D0E6",
    "piggy pink": "#FDDDE6",
    "pine green": "#158078",
    "pink flamingo": "#FC74FD",
    "pink sherbet": "#F78FA7",
    "plum": "#8E4585",
    "purple heart": "#7442C8",
    "purple mountain's majesty": "#9D81BA",
    "purple pizzazz": "#FE4EDA",
    "radical red": "#FF496C",
    "raw sienna": "#D68A59",
    "raw umber": "#714B23",
    "razzle dazzle rose": "#FF48D0",
    "razzmatazz": "#E3256B",
    "red": "#EE204D",
    "red orange": "#FF5349",
    "red violet": "#C0448F",
    "robin's egg blue": "#1FCECB",
    "royal purple": "#7851A9",
    "salmon": "#FF9BAA",
    "scarlet": "#FC2847",
    "screamin' green": "#76FF7A",
    "sea green": "#9FE2BF",
    "sepia": "#A5694F",
    "shadow": "#8A795D",
    "shamrock": "#45CEA2",
    "shocking pink": "#FB7EFD",
    "silver": "#CDC5C2",
    "sky blue": "#80DAEB",
    "spring green": "#ECEABE",
    "sunglow": "#FFCF48",
    "sunset orange": "#FD5E53",
    "tan": "#FAA76C",
    "teal blue": "#18A7B5",
    "thistle": "#EBC7DF",
    "tickle me pink": "#FC89AC",
    "timberwolf": "#DBD7D2",
    "tropical rain forest": "#17806D",
    "tumbleweed": "#DEAA88",
    "turquoise blue": "#77DDE7",
    "unmellow yellow": "#FFFF66",
    "violet (purple)": "#926EAE",
    "violet blue": "#324AB2",
    "violet red": "#F75394",
    "vivid tangerine": "#FFA089",
    "vivid violet": "#8F509D",
    "white": "#FFFFFF",
    "wild blue yonder": "#A2ADD0",
    "wild strawberry": "#FF43A4",
    "wild watermelon": "#FC6C85",
    "wisteria": "#CDA4DE",
    "yellow": "#FCE883",
    "yellow green": "#C5E384",
    "yellow orange": "#FFAE42"
};
var p = completely(
    document.getElementById('owner'),
    {
        fontFamily: 'sans-serif',
        fontSize: '26px',
        promptInnerHTML: ''
    });
p.options = colors;
p.onChange = function (text) {
    var c;
    p.startFrom = text.indexOf(',') + 1;
    var twocolors = text.split(',');
    c = c2h[twocolors[0]];
    if (c) document.body.style.backgroundColor = c;
    else document.body.style.backgroundColor = '#fff';
    c = c2h[twocolors[1]];
    if (c) document.getElementById('btm').style.backgroundColor = c;
    else document.getElementById('btm').style.backgroundColor = '#fff';
    p.repaint();
};
setTimeout(function () { p.input.focus(); p.repaint(); },
    0);