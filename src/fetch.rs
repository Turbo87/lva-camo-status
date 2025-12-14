const BASE_URL: &str = "https://status.camo-europe.aero/status";

pub fn fetch_status_html(id: &str) -> Result<String, ureq::Error> {
    let url = format!("{BASE_URL}/{id}");
    let response = ureq::get(&url).call()?;
    let body = response.into_body().read_to_string()?;
    Ok(body)
}
