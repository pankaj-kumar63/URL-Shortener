import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

const LinkResult = ({ inputValue }) => {
  const [shortenLink, setShortenLink] = useState("Shorten Link will be displayed here");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api.shrtco.de/v2/shorten?url=${inputValue}`)
      setShortenLink(res.data.result.full_short_link);
      // console.log(res.data.result.full_short_link);
    } catch (err) {
      setError(true);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (inputValue) {
      fetchData();
    }
  }, [inputValue])
  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [copied]);
  if (loading) {
    return <p className='noData'>Loading Shorten Link</p>
  }
  if (error) {
    return <p className='noData'>Something went wrong... Please check if your link is valid? </p>
  }
  return (<>
    {shortenLink && (
      <div className="result">
        <p>{shortenLink}</p>
        <CopyToClipboard
          text={shortenLink}
          onCopy={() => setCopied(true)}
        >
          <button className={copied ? "copied" : ""}>Copy to Clipboard</button>
        </CopyToClipboard>
      </div>
    )}
  </>)
}

export default LinkResult;