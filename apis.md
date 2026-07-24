
# `cite-architecture.js` API Documentation

This library provides tools for parsing, validating, comparing, and retrieving data associated with the CITE Architecture, consisting of CTS (Canonical Text Services) URNs, CITE2 URNs, and the CEX format for serialization.

## Table of Contents

[ TBD Table of Contents Here]

---

## The `CtsUrn` Class

A CTS-URN (Canonical Text Services URN) is a machine-actionable identfier for *identification and retrieval of passages of text* where "text" is defined as "an ordered hierarchy of citation-objects."

This library offers functions for working with CTS URNs.

CTS URNs have 5 components: `urn:cts:<namespace>:<bibliographic-component>:<passage-component>`

This library implements this with the `CtsUrn` class.

Create a new `CtsUrn` object with:

~~~javascript

my_ctsUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.10");

~~~

### `CtsUrn` Properties

The `CtsUrn` constructor parses and validates a Canonical Text Services (CTS) URN string and exposes the following read-only instance properties:

`CtsUrn.nid` — Namespace identifier (always "cts", lower-cased).

`CtsUrn.nss` — Namespace-specific string (*e.g.*, "greekLit", "latinLit").

`CtsUrn.textGroup` — Required first component of the bibliographic hierarchy.

`CtsUrn.workId` — Optional second component of the bibliographic hierarchy.

`CtsUrn.version` — Optional third component of the bibliographic hierarchy.

`CtsUrn.exemplar` — Optional fourth component of the bibliographic hierarchy.

`CtsUrn.passage` — Optional passage component (a string of dot-separated labels). May contain a single hyphen to denote a range. `undefined` when no passage component is present.

`CtsUrn.urnString` — The canonical input string (trimmed).

`CtsUrn.biblioComponent` — Array of the dot-separated parts of the bibliographic component (in order).

*Note on sub-referencing:* This JavaScript implementation does not support CTS URN sub-referencing using the @ syntax or bracketed indices (e.g., [1]). Such constructs are not parsed or preserved.All properties are set during construction. The constructor throws a CtsUrnError for any invalid input.

### `CtsUrn` Methods

The `CtsUrn` class provides the following instance methods. All manipulation methods return new `CtsUrn` instances (the original object is never mutated). Methods that cannot succeed throw a `CtsUrnError` with a descriptive message.

**Encapsulated Properties**

`CtsUrn.getPassage()` — Returns the passage component as a string, or an empty string if none is present.

**Classification**

`CtsUrn.hasPassage()` — Returns `true` if a passage component is present.

`CtsUrn.isRange()` — Returns `true` if the passage component contains a hyphen (range syntax).

`CtsUrn.isTextGroupUrn()` — Returns `true` only if the URN is at the textGroup level (no `workid`).

`CtsUrn.isWorkUrn()` — Returns `true` only if the URN is at the work level (has workid but no `version`).

`CtsUrn.isVersionUrn()` — Returns `true` only if the URN is at the version level (has version but no `exemplar`).

`CtsUrn.isExemplarUrn()` — Returns `true` only if the URN is at the exemplar level.

`CtsUrn.passageDepth()` — Returns the number of dot-separated fields in the passage component (non-range URNs only).

`CtsUrn.rangeDepth()` — Returns a two-element array [startDepth, endDepth] for range URNs.

**Comparison**

`CtsUrn.equals(other: CtsUrn)` — Returns `true` if the two URNs have identical canonical string representations.

`CtsUrn.versionEquals(other: CtsUrn)` — Returns `true` if the two URNs are identical when both are reduced to version level.

`CtsUrn.areCongruent(other: CtsUrn)` — Returns `true` if the URNs identify the same content under hierarchical prefix-matching rules for both bibliographic and passage components; a non-range URN can be congruent with a range-URN if both sides of the range-URN are contained by the non-range-URN.

`CtsUrn.isCongruentWith(other: CtsUrn)` = Like `areCongruent()`, but directional. Returns `true` if `this` identifies the same content as `other` under hierarchical prefix-matching rules for both bibliographic and passage components; a non-range URN can be congruent with a range-URN if both sides of the range-URN are contained by the non-range-URN. Returns `false` otherwise, that is, if `this` is more specific than `other` in either its bibliographic or passage components. "*Iliad*" `isCongruentWith` "*Iliad*, Allen ed." And, "*Iliad* 1" `isCongruentWith` "*Iliad* 1.1", but the reverse is not true.

`CtsUrn.passageEquals(other: CtsUrn)` — Returns `true` if the bibliographic hierarchy of `this` includes that of `other` and their passage components are identical.

`CtsUrn.passageIncludes(other: CtsUrn)` - Returns `true` if the bibliographic components are *identical* (`biblMatches`) **and** the passage component of `this` hierarchically includes the passage component of `other`.

`CtsUrn.passageContains(other: CtsUrn)` - A synonym for `passageIncludes()`, included for historical reasons.

`CtsUrn.biblMatches(other: CtsUrn)` - Returns `true` if the bibliographic-component of `this` exactly matches that of `other`.

**Retrieval**

`CtsUrn.toString()` — Returns the canonical URN string (also used for primitive coercion via Symbol.toPrimitive).

**Manipulation**

`CtsUrn.dropPassage()` — Returns a new `CtsUrn` with the passage component removed (always terminated by `:`).

`CtsUrn.reduceRange()` - Returns a new `CtsUrn`. For a special case where a range-URN identifies the same passage as both the start and end of the range. Reduces it to a non-range URN. Otherwise, returns the URN unchanged.

`CtsUrn.replacePassage(newPassage: string)` — Returns a new CtsUrn with the passage component replaced.

`CtsUrn.splitRange()` — For range URNs, returns a two-element array containing the start and end CtsUrn objects.

`CtsUrn.rangeFrom()` / `rangeStart()` — Returns the starting CtsUrn of a range.

`CtsUrn.rangeTo()` / `rangeEnd()` — Returns the ending CtsUrn of a range.

`CtsUrn.makeRange(other: CtsUrn)` — Constructs a new range URN spanning from this (or its start) to other (or its end).

`CtsUrn.versionLevelUrn()` — Returns a new CtsUrn reduced to the version level (drops passage and any exemplar).

`CtsUrn.workLevelUrn()` — Returns a new CtsUrn reduced to the work level.

`CtsUrn.versionFromExemplar()` — For exemplar-level URNs, returns the corresponding version-level URN (preserves passage if present).

`CtsUrn.addExemplar(exemplarId: string)` — Adds (or replaces) the exemplar component on a version-or-higher URN.

`CtsUrn.addPassage(psgString: string)` — Adds (or replaces) the passage component after validating its format.

`CtsUrn.chopPassage()` — Returns a new CtsUrn with the passage hierarchy reduced by one level (single passages only; drops passage entirely at depth 1).

`CtsUrn.extendPassage(citeString: string)` — Extends the passage hierarchy by one level with the supplied label (single passages only).

`CtsUrn.passageToDepth(depth: number)` — Reduces the passage hierarchy (both sides of a range) to the specified depth.

`CtsUrn.equalizePassageDepths(other: CtsUrn)` — Returns a pair of CtsUrn objects with passages chopped to the minimum common depth.

---

## CTS Data: The `CtsPassage` Class.

A `CtsPassage` unites text-content with a citation. A `CtsPassage` object has two components:

1. A `CtsUrn` (which may **not** be a range-urn).
2. A `string`.

Create a new `CtsPassage` object with, *e.g.*:

~~~javascript

my_ctsUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
my_text = "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";

my_ctspassage = new CtsPassage(my_ctsUrn, my_text);

~~~

Alternatively, you can use the static factory constructor:

~~~javascript

my_ctspassage = CtsPassage.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος");

~~~

### `CtsPassage` Properties.

The `CtsPassage` constructor accepts a `CtsUrn` object and a `string` and exposes the following read-only instance properties:

`CtsPassage.ctsUrn` - The `CtsUrn` citation.
`CtsPassage.text` - The text of the passage.

### `CtsPassage` Validation

The constructor validates its input `ctsUrn, text` and throws a `CtsPassageError` on failure. 

- `ctsUrn` must not be a range-urn.
- The `biblioComponent` of `ctsUrn` must be at the version-level or exemplar-level.
- `text` must be of type `string`.
- `text` may not be empty or consisting only of white-space.

### `CtsPassage` Methods

The `CtsPassage` class provides the following instance methods. The original object is never mutated. Methods that cannot succeed throw a `CtsPassageError` with a descriptive message.

`CtsPassage.fromString(passageString:string, delimiter:string = '"#")` - Creates a `CtsPassage` by splitting `passageString` at `delimiter`. Throws a `CtsPassage` error if the first part of the string will not construct a valid `CtsUrn`.

`CtsPassage.toString(delimiter:char = '#')` - Returns a `string` serializing the `urn` and `text` separated by `delimiter`. The optional `delimiter` parameter defaults to the character `'#'`.

`CtsPassage.getUrn()` - Returns the `CtsUrn` citation of the passage. Functionally equivalent to accessing the `.ctsUrn` property.

`CtsPassage.getText()` - Returns the text of the passage. Functionally equivalent to accessing the `.text` property.

`CtsPassage.equals(other: CtsPassage)` - Uses this `toString()` methods of `this` and `other` to judge equality.

---

## CTS Data Retrieval: The `CtsCorpus` Class.

A `CtsCorpus` is an Array of `CtsPassage` objects. 

**The order of the elements in the array is significant.**

Create a new `CtsCorpus` object with:

~~~javascript

psg1 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1"), "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος");
psg2 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2"),  "οὐλομένην, ἣ μυρί’ Ἀχαιοῖς ἄλγε’ ἔθηκε,");
psg3 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3"), "πολλὰς δ’ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν");

my_ctscorpus = new CtsCorpus([ psg1, psg2, psg3]);

~~~

Alternatively, you can create a `CtsCorpus` from a string thus:

~~~javascript

const cexString = `urn:cts:greekLit:tlg0013.tlg002.fucex:1#Δήμητρ' ἠύκομον, σεμνὴν θεόν, ἄρχομ' ἀείδειν,
urn:cts:greekLit:tlg0013.tlg002.fucex:2#αὐτὴν ἠδὲ θύγατρα τανύσφυρον, ἣν Ἀιδωνεὺς 
urn:cts:greekLit:tlg0013.tlg002.fucex:3#ἥρπαξεν, δῶκεν δὲ βαρύκτυπος εὐρύοπα Ζεύς,`

const demeterCorpus = CtsCorpus.fromString(cexString, "#");

~~~

### `CtsCorpus` Validation

The constructor validates its input `Array[CtsPassage]` and throws a `CtsCorpusError` on failure. 

For validation purposes:

- A “text” is the set of all passages in the corpus whose URNs mutually satisfy `CtsUrn.biblMatches(other)`.
- A `CtsCorpus` may contain passages from multiple texts.
- It *is allowed* to create a `CtsCorpus` with an empty passage-array. Doing so will not throw an error.
- All passages belonging to the same text must appear as a single contiguous block in the array (texts may not be interleaved).
- Every passage in the corpus must have a unique `CtsUrn`.
- Every passage in the corpus must be a node-level (atomic) citation: for any two distinct passages `u1` and `u2` in the corpus, `u1.passageContains(u2)` must be `false`. (In other words, no passage citation in the corpus may hierarchically contain another passage citation in the same corpus.)
- The relative order of passages within each text block is assumed to reflect the canonical reading order of the source text. This assumption cannot be automatically validated and is the responsibility of the creator of the corpus.


### `CtsCorpus` Properties.

The `CtsCorpus` constructor accepts an `Array[CtsPassage]` and exposes the following read-only instance properties:

`CtsCorpus.passages` - The Array of passages.

`CtsCorpus.urns` - An `Array[CtsUrn]` of the URNs for all passages in the corpus.

`CtsCorpus.texts` = An `Array[CtsUrn]` of URNs of the texts present in this corpus based on the `CtsUrn.biblioComponent` property of each passage's urn.

`CtsCorpus.length` - The number of passages in the array.

`CtsCorpus.summary` - a String summary stating that this is a `CtsCorpus`, its size, and the URN and a portion of the text of the first passage in the corpus.

### `CtsCorpus` Methods.

The `CtsCorpus` class provides the following instance methods. All manipulation methods return new `CtsCorpus` instances (the original object is never mutated). Methods that cannot succeed throw a `CtsCorpusError` with a descriptive message.

**Constructing & Serializing**

`CtsCorpus.fromString(cexstring, delimiter = "#")` - Constructs a `CtsCorpus` from a multi-line string. Each line of the string must consist of a URN-string, a delimiter (`"#"` by default), and a passage-string. The function uses `CtsPassage.fromString()`, and the rules are the same. If `cexstring` begins with a "#!ctsdata" header-line, it is disregarded.

`CtsCorpus.toString(delimiter: Char = '#')` - Serialized a corpus into a string, with passages separated by `\n`. Uses `CtsPassage.getString(delimiter = '#')` by passing on the value of `delimeter`.

**Assessing Contents**

`CtsCorpus.hasText(urn: CtsUrn)`: Returns `true` if the text identified by `urn` is represented by any passage in the corpus. `urn` may contain a passage-component, which is ignored by this function. 

`CtsCorpus.getValidReff(urn?: CtsUrn)` - Returns an `Array[CtsUrn]`. With no argument → every passage URN in the corpus (corpus order). With a `CtsUrn` argument → only those passage URNs for which `urn.isCongruentWith(corpusPassageUrn)` is true (directed hierarchical prefix-matching on both the bibliographic component and the passage component). When the argument is a range, the result is the contiguous slice between the first and last matching nodes *within each text*.

`CtsCorpus.countValidReff(urn: CtsUrn)`: Returns the number of valid references (`Int`) that match the criteria of `getValidReff(urn)`. Requires a `CtsUrn` argument. (Without a `CtsUrn` filter, the results would be the same as the corpus' `.length` property.)

`CtsCorpus.isValidRef(urn: CtsUrn)`: Returns `true` if the corpus contains a passage with this exact `CtsUrn` (uses `CtsUrn.equals()`). Returns `false` otherwise.

`CtsCorpus.isValidRange(urn: CtsUrn)` - Returns `true` if there is a passage in the corpus that matches the start of the range, and one that matches the end of the range.

`CtsCorpus.corpusRanges(urn?: CtsUrn)` - Returns an `Array[CtsUrn]` of range-urns for each text in the corpus, from the first passage of each to the last of each. The optional `urn` parameter will filter the results by urn-containment, like `CtsCorpus.getValidReff()`. If the `CtsCorpus.passages` is an empty array, of if the filter on the `urn` parameter returns no matches, returns an empty array. Parameter `urn` may have a passage component, but it is ignored.

`CtsCorpus.rangesFromPassages([CtsPassage])` - Returns a range-`CtsUrn` identifying the passages in an `Array[CtsPassage]`. The parameter-Array must pass the same validation standards as the `CtsCorpus` constructor.

`CtsCorpus.listTexts(urn?: CtsUrn)` - Return an `Array[CtsUrn]` listing the texts present in the corpus, based on the `CtsUrn.biblioComponent` property of each passage's urn. Parameter `urn` may have a passage-component, but it is ignored. Without the `urn` parameter, it returns the valueof `CtsCorpus.texts`.

**Refining the Contents of a Corpus**

`CtsCorpus.textCorpora()` - Returns an `Array[CtsCorpus]`, one for each distinct "text" (group of passages sharing the same bibliographic component via `Cts.dropPassage()`). The order of the returned corpora preserves the order in which the texts first appear in the original corpus.

`CtsUrn.textCorpus(urn: CtsUrn)` - Returns a `CtsCorpus` consisting only of passages from the same text as `urn`.

**Text Retrieval Methods**

> Precisely tailored retrieval of passages from a `CtsCorpus` can be achieved by accessing the CtsCorpus.passages and filtering it using the comparison methods built into the `CtsUrn` class.

`CtsCorpus.getPassage(urn: CtsUrn)` - Returns one and only one `CtsPassage`, whose URN is an exact match with parameter `urn`. Does *not* do any matching based on hierarchy of bibliography or passage. Mainly a helper-method for other methods.

`CtsCorpus.getText(urn: CtsUrn)` Returns a new `CtsCorpus` containing the passages identified by `getValidReff(urn)`.  This is the primary retrieval method for obtaining a whole text, a version, an exemplar, or any hierarchical sub-section.

`CtsCorpus.findPassages(urn: CtsUrn)` - Returns a new `CtsCorpus` containing every passage for which `urn.isCongruentWith(passage.ctsUrn)` is true (the same directed hierarchical test used by `getValidReff`).

**Navigating a Corpus**

`CtsCorpus.getFirstRef(urn?: CtsUrn)` - Returns a `CtsUrn`, the citation to the first passage of the corpus. If a `CtsUrn` is given, drops the passage-component and returns the first citation of the first text *congruent* to the parameter-urn.

`CtsCorpus.getFirstPassage(urn: CtsUrn)` - Returns a `CtsPassage`. Like `getFirstRef()`, but returns the whole `CtsPassage`.

`CtsCorpus.getPrevRef(urn: CtsUrn)` - Returns a `CtsUrn`. Gets the urn of the passage preceding the given urn in the corpus. Returns `null` if the urn points to the first passage of the corpus. Returns `null` if `urn` does have not an exact match in the corpus.

`CtsCorpus.getNextRef(urn: CtsUrn)` - Returns a `CtsUrn`. Gets the urn of the passage following the given urn in the corpus. Returns `null` if the urn points to the last passage of the corpus. Returns `null` if `urn` does have not an exact match in the corpus.

`CtsCorpus.getPrev(urn:CtsUrn)` - Returns a `CtsPassage`. Gets the passage preceding the passage with the given urn in the corpus. Returns `null` if the urn points to the first passage of the corpus. Returns `null` if `urn` does have not an exact match in the corpus.

`CtsCorpus.getNext(urn: CtsUrn)` - Returns a `CtsPassage`. Gets the passage following the passage with the given urn in the corpus. Returns `null` if the urn points to the last passage of the corpus. Returns `null` if `urn` does have not an exact match in the corpus.

**For Browsing a Corpus**

`CtsCorpus.slideRange(urn:CtsUrn, step:Int)` - Returns a range-`CtsUrn`. Based on the start- and end-passages of the given range-urn, return a URN identifying a range whose starting passage and ending passage are `step` passages forward or backward. A positive `step` moves forward, toward the end of the corpus; a negative `step` moves backwards, toward the beginning of the corpus. If corpus `this` contains more than one text, `.slideRange()` will not move beyond the text identified by the parameter urn. 

If the "step"  would move the *end* of the range beyond the end of the text, returns a smaller "window", whose last passage is the last passage of the text in this corpus. If the "step" would move the *start* of the range beyond the end of the requested text,  returns `null`.

If the "step" would move the *start* of the range beyond the first passage of the text, returns a smaller "window", whose first passage is the first passage of the text in this corpus. If the "step" would move the *end* of the range before the start of the passage, returns `null`.

`CtsCorpus.pageForward(urn: CtsUrn)` - Uses `Cts.slideRange()` to deliver a `CtsUrn` for the next "page" of passages in a text. That is, if `urn` points to N-passages, returns a URN to the next group of N passages. If there are not N passages between the passages pointed to by the parameter URN and the end of the text, uses the same logic as `.slideRange()`. Returns `null` if there is no next page to point to.

`CtsCorpus.pageBackward(urn)` - Uses `Cts.slideRange()` to deliver a `CtsUrn` for the previous "page" of passages in a text. That is, if `urn` points to N-passages, returns a URN to the previous group of N passages. If there are not N passages between the passages pointed to by the parameter URN and the beginning of the text, uses the same logic as `.slideRange()`. Returns `null` if there is no next page to point to.

`CtsCorpus.changeContext(urn: CtsUrn, after: {Int}, before?: {Int}` - Given a `CtsUrn` identifying a chunk of a corpus, returns a range-`CtsUrn` a larger or smaller chunk. The `after` parameter determines how many passages will be added to the end of the URN (positive value) or subtracted from it (negative value). The `before` parameter determines how many will be added (positive values) or subtracted (negative values) from the beginning of the URN. Limited by the bounds of the text. Never returns `null`. At the extreme of reducing context, returns a single-passage URN. At the extremes of expanding context, returns a range identifying the whole text. 

---

## CTS Metadata: The `CtsCatalogEntry` Class and `CtsCatalog` Class

The `CtsCatalogEntry` class provides metadata for one text. `CtsCatalog` can contain one or more `CtsCatalogEntry` objects.


### The `CtsCatalogEntry` Class: Construction & Validation

A `CtsCatalogEntry` 

A CTS Catalog Entry has 8 properties.

This library implements this with the `CtsCatalogEntry` class.

Create a new `CtsCatalogEntry` object with:

~~~javascript

new CtsCatalogEntry(ctsUrn, citationScheme, groupName, workTitle, versionLabel, exemplarLabel, online, lang)

~~~

Alternatively, construct it with the static factory method `CtsCatalogEntry.fromString()`, *e.g.*:

~~~ javascript

my_ctscatalogentry = CtsCatalogEntry.fromString("urn:cts:greekLit:tlg0012.tlg001.perseus.tokens:#book/line/token#Homeric Epic#Iliad#Perseus Greek, following Allen#Syntactical Tokens#true#grc");

~~~

### `CtsCatalogEntry` Properties

The `CtsCatalogEntry` constructor a Catalog Entry object and exposes the following read-only instance properties:

- `CtsCatalogEntry.ctsUrn` - The `CtsUrn` identifying a text. The URN may not have a passage-component.
- `CtsCatalogEntry.citationScheme` - A `String` naming the parts of the text's citation hierarchy. There may be more than one set of labels. The basic pattern is, *e.g.* `book/line`, or `book/section/paragraph`, or `book/line/token`. This is *not* rigorously enforced, merely a convenience.
- `CtsCatalogEntry.groupName` - A `String` giving a description to the `groupName` component of the `CtsUrn`.
- `CtsCatalogEntry.workTitle` - A `String` giving a description to the `workid` component of the `CtsUrn`.
- `CtsCatalogEntry.versionLabel` - A `String` giving a description to the `version` component of the `CtsUrn`. May be `null`.
- `CtsCatalogEntry.exemplarLabel` - A `String` giving a description to the `exemplar` component of the `CtsUrn`. May be `null`. 
- `CtsCatalogEntry.online` - A `Boolean`. Meaningful only in the context of a `CtsCatalog`: `true` if the text named by the entry is present in the catalog.
- `CtsCatalogEntry.lang` - The ISO 639-2 3-letter language code describing the principal language of the text.


### `CtsCatalogEntry` Methods

The `CtsCatalogEntry` class provides the following instance methods. The original object is never mutated. Methods that cannot succeed throw a `CtsCatalogEntryError` with a descriptive message.

**Constructing & Serializing**

`CtsCatalogEntry.fromString( string: String, delimiter: String = "#")` - Constructs a `CtsCatalogEntry` object from a string of properties, in construction order, separated by `delimiter`.

`CtsCatalogEntry.toString( cexheader: Boolean = false)` - Returns a `string` serialization of the entry, with properties in construction-order, separated by `delimiter`. If the optional `cexheader` parameter is `true`, precedes the entry with `#!ctscatalog` on its own line.

`CtsCatalogEntry.prettyPrint()` - Returns a `string` serialization of the entry formatted for plain-text legibility.

`CtsCatalogEntry.prettyPrintMarkdown()` - Returns a `string` serialization of the entry formatted in Markdown for plain-text legibility. Deployers should feel free to customize this according to need and taste.

`CtsCatalogEntry.prettyPrintHTML()` - Returns a `string` serialization of the entry formatted with simple HTML for legibility. Deployers should feel free to customize this according to need and taste.

**Comparison**

`CtsCatalogEntry.equals()` - Since a `CtsCatalogEntry` mostly exists to provide human-readable metadata, "equality" between two is defined only in terms of the `.ctsUrn` property. (Note: the `.online` property does *not* factor in equality; if it did, we might have a situation where the same text is cataloged as both online and not-online.)

**Cataloging and Describing Texts**

`CtsCatalogEntry.isEntryForText(urn: CtsUrn )` - Returns `true` if the `ctsUrn` property of the entry *equals* the parameter urn, minus any passage-component.

`CtsCatalogEntry.entryDescribesText( urn: CtsUrn )` - Returns `true` if the `ctsUrn` property is *congruent with* the parameter urn, minus any passage-component.

---

## CTS Data & Metadata: The `CtsLibrary` Class

The `CtsLibrary` class combines a corpus of passages of text with metadata describing the passages. It consists of:

1. An `Array[CtsCatalogEntry]`
2. A `CtsCorpus`

Create a new `CtsLibrary` object with, *e.g.*:

~~~javascript

my_catalog_entry1 = CtsCatalogEntry.fromString(entry_string1);
my_catalog_entry2 = CtsCatalogEntry.fromString(entry_string2);
catalogEntries = [my_catalog_entry1, my_catalog_entry2];
ctsCorpus = CtsCorpus.fromString(corpus_string);

my_ctsLibrary = new CtsLibrary(catalogEntries, ctsCorpus);

~~~

Alternatively, you can use `CtsLibrary.fromCex()`:

~~~javascript

my_ctsLibrary = CtsLibrary.fromCex(`

// A minimal CEX serialization of a CtsLibrary

#!ctscatalog
urn#citationScheme#groupName#workTitle#versionLabel#exemplarLabel#online#lang
urn:cts:greekLit:tlg0012.tlg001.mendes:#book/line#Homeric Epic#Iliad#Manuel Odorico Mendes, 1864##true#por
urn:cts:greekLit:tlg0012.tlg001.allen:#book/line#Homeric Epic#Iliad#Greek. Allen, ed. Perseus Digital Library. Creative Commons Attribution 3.0 License##true#grc
urn:cts:croala:kunicr.ilias.croala_ohco2:#book/line#Kunić, Rajmund#Ilias#Latin. Hanc editionem electronicam curavit Neven Jovanović. CroALa 2013.  Modified and distributed under the terms of the CC BY-NC-SA 3.0 HR licence.##false#lat

#!ctsdata
urn:cts:greekLit:tlg0012.tlg001.mendes:1.1#Canta-me, ó deusa, do Peleio Aquiles
urn:cts:greekLit:tlg0012.tlg001.mendes:1.2#A ira tenaz, que, lutuosa aos Gregos,
urn:cts:greekLit:tlg0012.tlg001.mendes:1.3#Verdes no Orco lançou mil fortes almas,
urn:cts:greekLit:tlg0012.tlg001.allen:1.1#Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος 
urn:cts:greekLit:tlg0012.tlg001.allen:1.2#οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, 
urn:cts:greekLit:tlg0012.tlg001.allen:1.3#πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν 

`);

~~~

### `CtsLibrary` Properties.

The `CtsLibrary` constructor accepts an `Array[CtsCatalogEntry]` and a `CtsCorpus` object:

`CtsLibrary.catalog` - The `Array[CtsCatalogEntry]`.
`CtsLibrary.corpus` - The `CtsCorpus` object.

### `CtsLibrary` Validation

The constructor validates its input `catalogEntries, ctsCorpus` and throws a `CtsLibraryError` on failure. 

- The `CtsCatalogEntry` objects in `.catalog` must be unique according to `CtsCatalogEntry.equals()`, which tests URNs only.
- If, for any catalog entry, `CtsCatalogEntry.online` is `true`, at least one passage of text in the corpus must represent that text using exact bibliographic equality after `.dropPassage()`.
- If, for any catalog entry, `CtsCatalogEntry.online` is `false`, *no* passage of text in the corpus may represent that entry.

### `CtsLibrary` Methods

All instances of `CtsLibrary` are immutable. Methods that return a `CtsLibrary` return a new instance. Methods that cannot succeed throw a `CtsLibraryError`. 

**Construction & Serialization**

`CtsLibrary.toString( delimiter {String} = "#")` - Serializes the `CtsLibrary` to a string. The `.catalog` is serialized with a block-header-line, `#!ctscatalog`, followed immediately by a header-line…

	#!ctscatalog
	urn#citationScheme#groupName#workTitle#versionLabel#exemplarLabel#online#lang
	[ … CtsCatalogEntry string-serializations … ]

followed immediately by each `CtsCatalogEntry` on one line. A blank line follows. Then a `#!ctsdata` header, followed immediately by the string serialization of the `.corpus`:

	#!ctsdata
	[ … CtsPassage string-serializations … ]

`CtsLibrary.fromCex( cexString {String}, delimiter {String} = "#")` - Constructs a new `CtsLibrary` from a `String`. Reads a `String` by line. Looks for one-or-more block of catalog-data, marked by the header `#!ctscatalog` and followed immediately by string-representations of `CtsCatalogEntry` objects. These are aggregated into the `CtsLibrary.catalog` property. Looks for one-or-more block of CTS-passage data, marked by the header `#!ctsdata` followed immediately by lines representing serializations of `CtsPassage` objects. Aggregates those into the `CtsLibrary.corpus` property. Ignores other content, blank lines, or comments beginning `//` in `cexString`.

In the case of multiple `#!ctscatalog` blocks in the source CEX file, the resulting `CtsLibrary.catalog` will be the union of all blocks. In the case of duplicate entries across `#!ctscatalog` blocks, where `first_ctsCatalogEntry.equals(second_ctsCatalogEntry)`, the second will be discarded. The `.online` property of any `CtsCatalogEntry` will be set `true` if that text is represented by any passage in the new `.corpus`. Entries that remain unrepresented in the final corpus keep (or are set to) `.online = false`. The resulting object is then validated by the normal constructor rules.

Passages across multiple `#!ctsdata` blocks will be included in the new library's `.corpus`. If, however, two `#!ctsdata` blocks contain passages of the exact same text (bibliographic equality after `.dropPassage()`), the constructor throws a `CtsLibraryError`. 

> The reason for this is that text-order is preserved in a CEX text by order of passages as they appear in a `#!ctsdata` block. With a single text's passage appearing in two discrete blocks, there is no way to determine and preserve their canonical order.

**Catalog Accessors**

`CtsLibrary.onlineTexts()` - Returns an `Array[CtsCatalogEntry]` for all texts whose catalog entries have `.online == true`. 

`CtsLibrary.offlineTexts()` - Returns an `Array[CtsCatalogEntry]` for all texts whose catalog entries have `.online == false`. 

`CtsLibrary.sizeOfText( urn {CtsUrn})` - Returns an `Int`, the number of passages present for the text identified by `urn` in `this.corpus`. Uses `this.corpus.getValidReff()` for matching. The bibliographic level of `urn`, whether it is a range, or the presence of deeper passage components will affect the reported size. Throws `CtsLibraryError` if `urn` returns no matches.

**Subsetting / Retrieval**

`CtsLibrary.entryForUrn(urn: CtsUrn)` 
Returns the single `CtsCatalogEntry` whose `.ctsUrn` exactly matches the bibliographic component of `urn` (i.e. `entry.ctsUrn.biblMatches(urn)` after any passage component is dropped). Throws `CtsLibraryError` if no such entry exists in `this.catalog`.

`CtsLibrary.entriesForCorpus(corpus: CtsCorpus)`  
Returns an `Array[CtsCatalogEntry]` containing the entry for every distinct text present in the supplied `corpus` (exact bibliographic match via `biblMatches`).  
Throws `CtsLibraryError` if any text in `corpus` lacks a corresponding entry in `this.catalog`.

`CtsLibrary.entriesForUrns(urns: Array[CtsUrn])`  
Same as `entriesForCorpus`, but the texts are those identified by the supplied array of URNs.


`CtsLibrary.libraryFromUrn(urn: CtsUrn)`  
Returns a new `CtsLibrary` whose contents are limited to the texts described by `urn`.

- New corpus = `this.corpus.getText(urn)` (i.e. every passage for which `urn.isCongruentWith(passage.ctsUrn)`).  
- New catalog = every entry in `this.catalog` for which `urn.isCongruentWith(entry.ctsUrn)` (hierarchical, so a work-level filter retains all its versions/exemplars).  
- For each retained entry, `.online` is set to `true` if and only if the new corpus contains at least one passage whose bibliographic component equals `entry.ctsUrn`; otherwise `.online` is set to `false`.  

Throws `CtsLibraryError` if the resulting corpus is empty (i.e. `urn` matches nothing).

`CtsLibrary.libraryFromUrns(urns: Array[CtsUrn])`  
Identical to `libraryFromUrn`, but the new corpus is the union of `getText` results for every URN in the array, and the catalog retains every entry congruent with *any* of the filter URNs. Online flags are recomputed against the unioned corpus. Throws `CtsLibraryError` if any URN in urns lacks a corresponding entry in this.catalog.

`CtsLibrary.libraryFromCorpus(corpus: CtsCorpus)`  
Returns a new `CtsLibrary` that pairs the supplied `corpus` with the catalog entries that describe its texts. Throws `CtsLibraryError` if any URN in urns lacks a corresponding entry in this.catalog.

- New corpus = the supplied `corpus` (assumed to be a subset; no further filtering).  
- New catalog = the entries obtained by `this.entriesForCorpus(corpus)` (exact match).  
- Every retained entry has `.online = true` (because the texts are present by construction).  

Throws `CtsLibraryError` if any text in the supplied corpus lacks a catalog entry in `this.catalog`.

---

[ BELOW HERE IS ALL TBD! IGNORE!]

`CtsCorpus.chunkedUrns( urn: CtsUrn, level: Int, maxSize: Int = 0 )` - Returns an `Array[CtsUrn]` of range-URNs. Uses `CtsCorpus.getText(urn)` to define a new `CtsCorpus`. Divides that corpus into chunks, returning a range-`CtsUrn` identifying each chunk. The parameter `level` defines the initial division of the passages in the corpus according to the passage-hierarchy. With `level = 2`, passages `:1.1.1, :1.1.3, :1.1.3` will be in one chunk, and `:1.2.1, :1.2.2, :1.2.3` in another. The parameter `maxSize` allows for further division if chunking by citation-level would produce chunks with many passages. `maxSize = 0` sets no limit. `maxSize = 100` would divide the citation-level chunk into chunks of up to 100 passages.

## CITE Data: The Cite2Urn Class

[ WORK IN PROGRESS ]

Functions for working with CITE2 URNs.
CITE2 URNs have 5 components: `urn:cite2:<namespace>:<collection-component>:<object-component>`

### Cite2Urn Properties

[ TBD Description of Cite2Urn properties here. ]

### Cite2Urn Methods

[ TBD Description of Cite2Urn methods here. ]

---

## CITE2 Data Retrieval: The `CiteCollection` Class.

[ TBD Description of `CiteCollection` Class here. ]

---

## CTS and CITE2 Data Aggregation: The `CiteRelations` Class.

[ TBD Description of `CiteRelations` Class here. ]

---

## Special Collection Properties: The `CiteDataModel` Class.

[ TBD Description of `CiteDataModel` Class here. ]

---

## CITE Serialization: The `CiteCex` Class

