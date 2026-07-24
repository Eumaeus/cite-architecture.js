// --------------------------
// --- CtsCatalogEntry Class -----
//
// A CtsCatalogEntry provides metadata for one text identified by a CTS URN
// (the URN must not contain a passage component).
//
// Example:
//
//   const u = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.perseus.tokens:");
//   const entry = new CtsCatalogEntry(
//     u,
//     "book/line/token",
//     "Homeric Epic",
//     "Iliad",
//     "Perseus Greek, following Allen",
//     "Syntactical Tokens",
//     true,
//     "grc"
//   );
//
// Or from the canonical CEX form:
//
//   CtsCatalogEntry.fromString(
//     "urn:cts:greekLit:tlg0012.tlg001.perseus.tokens:#book/line/token#Homeric Epic#Iliad#Perseus Greek, following Allen#Syntactical Tokens#true#grc"
//   );
//
// --------------------------

class CtsCatalogEntryError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsCatalogEntryError";
  }
}

class CtsCatalogEntry {
  constructor(ctsUrn, citationScheme, groupName, workTitle, versionLabel, exemplarLabel, online, lang) {

    // ---- Validation ----
    if (!(ctsUrn instanceof CtsUrn)) {
      throw new CtsCatalogEntryError(`'${ctsUrn}' is not a valid CtsUrn.`);
    }
    if (ctsUrn.hasPassage()) {
      throw new CtsCatalogEntryError(
        `CtsCatalogEntry cannot be constructed from a URN with a passage-component ('${ctsUrn.getPassage()}'): ${ctsUrn}`
      );
    }

    if (typeof citationScheme !== "string" || citationScheme.trim() === "") {
      throw new CtsCatalogEntryError("`citationScheme` must be a non-empty string");
    }

    if (typeof groupName !== "string" || groupName.trim() === "") {
      throw new CtsCatalogEntryError("`groupName` must be a non-empty string");
    }

    // workTitle / versionLabel / exemplarLabel may be null (or a string).
    // If the URN contains the corresponding component, a non-empty description is required.
    if (workTitle !== null && typeof workTitle !== "string") {
      throw new CtsCatalogEntryError("`workTitle` must be a string or null");
    }
    if (ctsUrn.work && (workTitle === null || workTitle.trim() === "")) {
      throw new CtsCatalogEntryError(`There must be a non-empty work description for ${ctsUrn.work}.`);
    }

    if (versionLabel !== null && typeof versionLabel !== "string") {
      throw new CtsCatalogEntryError("`version` must be a string or null");
    }
    if (ctsUrn.version && (versionLabel === null || versionLabel.trim() === "")) {
      throw new CtsCatalogEntryError(`There must be a non-empty version description for ${ctsUrn.version()}.`);
    }

    if (exemplarLabel !== null && typeof exemplarLabel !== "string") {
      throw new CtsCatalogEntryError("`exemplarLabel` must be a string or null");
    }
    if (ctsUrn.exemplar && (exemplarLabel === null || exemplarLabel.trim() === "")) {
      throw new CtsCatalogEntryError(`There must be a non-empty exemplarLabel description for ${ctsUrn.exemplar}.`);
    }

    if (typeof online !== "boolean") {
      throw new CtsCatalogEntryError("`online` must be a Boolean (true/false)");
    }

    if (typeof lang !== "string" || lang.trim().length !== 3) {
      throw new CtsCatalogEntryError("`lang` must be an ISO 639-2 3-letter language code.");
    }

    // ---- Read-only properties (camelCase, matching current apis.md) ----
    this.ctsUrn         = ctsUrn;
    this.citationScheme = citationScheme.trim();
    this.groupName      = groupName.trim();
    this.workTitle           = (workTitle === null || workTitle.trim() === "") ? null : workTitle.trim();
    this.versionLabel        = (versionLabel === null || versionLabel.trim() === "") ? null : versionLabel.trim();
    this.exemplarLabel       = (exemplarLabel === null || exemplarLabel.trim() === "") ? null : exemplarLabel.trim();
    this.online         = online;
    this.lang           = lang.trim().toLowerCase();

    // Convenience for serialization
    this.parts = [
      this.ctsUrn.toString(),
      this.citationScheme,
      this.groupName,
      this.workTitle     === null ? "" : this.workTitle,
      this.versionLabel  === null ? "" : this.versionLabel,
      this.exemplarLabel === null ? "" : this.exemplarLabel,
      this.online.toString(),
      this.lang
    ];
  }

  // =========================================================
  // Construction & Serialization

  static fromString(cexstring, delimiter = "#") {
    if (typeof cexstring !== "string") {
      throw new CtsCatalogEntryError("Input must be a string.");
    }
    const parts = cexstring.split(delimiter).map(p => p.trim());
    if (parts.length < 8) {
      throw new CtsCatalogEntryError(
        `String must contain at least 8 fields separated by '${delimiter}'. Got ${parts.length}.`
      );
    }

    const [urnStr, scheme, groupName, workTitle, versionLabel, exemplarLabel, onlineStr, lang] = parts;
    const urn    = new CtsUrn(urnStr);
    const online = (onlineStr.toLowerCase() === "true");

    return new CtsCatalogEntry(
      urn,
      scheme,
      groupName,
      workTitle     === "" ? null : workTitle,
      versionLabel  === "" ? null : versionLabel,
      exemplarLabel === "" ? null : exemplarLabel,
      online,
      lang
    );
  }

  toString(cexheader = false, delimiter = "#") {
    const line = this.parts.join(delimiter);
    return cexheader ? `#!ctscatalog\n${line}` : line;
  }

  prettyPrint() {
    return [
      "CTS Catalog Entry",
      `  URN:             ${this.ctsUrn}`,
      `  Citation scheme: ${this.citationScheme}`,
      `  Text group:      ${this.groupName}`,
      `  Work:            ${this.workTitle     === null ? "(none)" : this.workTitle}`,
      `  Version:         ${this.versionLabel  === null ? "(none)" : this.versionLabel}`,
      `  Exemplar:        ${this.exemplarLabel === null ? "(none)" : this.exemplarLabel}`,
      `  Online:          ${this.online}`,
      `  Language:        ${this.lang}`
    ].join("\n");
  }

  prettyPrintMarkdown() {
    return [
      "### CTS Catalog Entry",
      "",
      "| Field | Value |",
      "|-------|-------|",
      `| URN | \`${this.ctsUrn}\` |`,
      `| Citation scheme | ${this.citationScheme} |`,
      `| Text group | ${this.groupName} |`,
      `| Work | ${this.workTitle     === null ? "*none*" : this.workTitle} |`,
      `| Version | ${this.versionLabel  === null ? "*none*" : this.versionLabel} |`,
      `| Exemplar | ${this.exemplarLabel === null ? "*none*" : this.exemplarLabel} |`,
      `| Online | ${this.online} |`,
      `| Language | ${this.lang} |`
    ].join("\n");
  }

  prettyPrintHTML() {
    return `
<div class="cts-catalog-entry">
  <h3>CTS Catalog Entry</h3>
  <ul>
    <li><strong>URN:</strong> <code>${this.ctsUrn}</code></li>
    <li><strong>Citation scheme:</strong> ${this.citationScheme}</li>
    <li><strong>Text group:</strong> ${this.groupName}</li>
    <li><strong>Work:</strong> ${this.workTitle     === null ? "<em>none</em>" : this.workTitle}</li>
    <li><strong>Version:</strong> ${this.versionLabel  === null ? "<em>none</em>" : this.versionLabel}</li>
    <li><strong>Exemplar:</strong> ${this.exemplarLabel === null ? "<em>none</em>" : this.exemplarLabel}</li>
    <li><strong>Online:</strong> ${this.online}</li>
    <li><strong>Language:</strong> ${this.lang}</li>
  </ul>
</div>`.trim();
  }

  // =========================================================
  // Comparison

  /**
   * Equality is defined only by the ctsUrn ONLY.
   * (per the current API documentation).
   */
  equals(other) {
    if (!(other instanceof CtsCatalogEntry)) return false;
    return this.ctsUrn.equals(other.ctsUrn);
  }

  // =========================================================
  // Cataloging and Describing Texts

  isEntryForText(urn) {
    if (!(urn instanceof CtsUrn)) {
      throw new CtsCatalogEntryError("isEntryForText requires a CtsUrn");
    }
    return this.ctsUrn.equals(urn.dropPassage());
  }

  entryDescribesText(urn) {
    if (!(urn instanceof CtsUrn)) {
      throw new CtsCatalogEntryError("entryDescribesText requires a CtsUrn");
    }
    return this.ctsUrn.areCongruent(urn.dropPassage(), false);
  }

  // Primitive coercion (handy for debugging / logging)
  [Symbol.toPrimitive](hint) {
    return this.toString();
  }
}