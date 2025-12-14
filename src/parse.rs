use scraper::{Html, Selector};
use thiserror::Error;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ParsedStatus {
    pub camo: String,
    pub easa_type: String,
    pub easa_variant: String,
}

#[derive(Debug, Error)]
pub enum ParseError {
    #[error("CAMO status not found")]
    CamoStatusNotFound,
    #[error("{0} not found")]
    FieldNotFound(&'static str),
}

pub fn parse_status_html(html: &str) -> Result<ParsedStatus, ParseError> {
    let document = Html::parse_document(html);

    let camo = parse_camo_status(&document)?;
    let easa_type = parse_definition_value(&document, "EASA Type")?;
    let easa_variant = parse_definition_value(&document, "EASA Variant")?;

    Ok(ParsedStatus {
        camo,
        easa_type,
        easa_variant,
    })
}

fn parse_camo_status(document: &Html) -> Result<String, ParseError> {
    let selector = Selector::parse("li").unwrap();

    for element in document.select(&selector) {
        let text = element.text().collect::<String>();
        if let Some(status) = text.strip_prefix("CAMO: ") {
            return Ok(status.trim().to_string());
        }
    }

    Err(ParseError::CamoStatusNotFound)
}

fn parse_definition_value(document: &Html, term: &'static str) -> Result<String, ParseError> {
    let dt_selector = Selector::parse("dt").unwrap();
    let dd_selector = Selector::parse("dd").unwrap();

    let dts: Vec<_> = document.select(&dt_selector).collect();
    let dds: Vec<_> = document.select(&dd_selector).collect();

    for (i, dt) in dts.iter().enumerate() {
        let dt_text = dt.text().collect::<String>();
        if dt_text.trim() == term
            && let Some(dd) = dds.get(i)
        {
            return Ok(dd.text().collect::<String>().trim().to_string());
        }
    }

    Err(ParseError::FieldNotFound(term))
}

#[cfg(test)]
mod tests {
    use super::*;
    use insta::assert_debug_snapshot;

    #[test]
    fn test_parse_grounded_status() {
        let html = include_str!("../tests/fixtures/U6N4A8Ea.html");
        let result = parse_status_html(html);
        assert_debug_snapshot!(result);
    }

    #[test]
    fn test_parse_prewarning_status() {
        let html = include_str!("../tests/fixtures/2JRWNcNfX.html");
        let result = parse_status_html(html);
        assert_debug_snapshot!(result);
    }
}
