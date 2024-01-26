const P = () => class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/bge-small-en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            let {pipeline, env} = await Function('return import("@xenova/transformers")')();
            this.instance = pipeline(this.task, this.model, {progress_callback});
            return this.instance;
        }
    }
}

test = {
    "host": "localhost:9081",
    "connection": "keep-alive",
    "content-length": "954",
    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
    "accept": "application/json, text/javascript, */*; q=0.01",
    "content-type": "application/json",
    "x-requested-with": "XMLHttpRequest",
    "sec-ch-ua-mobile": "?0",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "sec-ch-ua-platform": "\"macOS\"",
    "origin": "http://localhost:9081",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "referer": "http://localhost:9081/p/edit/localstore-1/?features=js-ai-text-suggest-experiment",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,ru;q=0.8,en-GB;q=0.7,lv-LV;q=0.6,lv;q=0.5,ru-RU;q=0.4,hr;q=0.3",
    "cookie": "feature_cookie=\"{\\\"js-ai-text-suggest-experiment\\\":true}\"; Webstorm-afde6f26=787a7100-3796-453f-b03a-cd1314badb2d; csrftoken=lrej1GhlGDLf1qJTYBrMArSQNy53K1zk; prezi-auth=.eJy9WVtvpDYY_S-8NhPhmcncntqq1Uq9SW33pYoiy4CZcQYwa5tJJ6v8937GBmwDUfZWRdpkwHz-LuccH2Y_RjklqhEUS6qiw_1qs1vF69V2tY5XaA9_xbvdzX18o38Q_Jh_P-Hn4eEmKohUuCIljQ7RX83zkUQ3EZNYKpLn0UGJhsIaltJKUhkdPkYpF1T_vpCCZbipFCvgyWW8jhdouVgheNzL-mNUM5WesKAlVxTXgkpawfWcFBJCm5u1YBeSXvGJZRmt-ps8zwtWQSByoV0u5oG0kYqXuOBHHh3i7qokBZU5FynFrFL0KIhifAinU8c0Y6qP1SQFkyfMypoLhTOiSHRANxFhokuUClxB3rLdpWwKkpWswjU5UlzSMqHC3EkEqTJ81qH7bFJell6pdrepyBmVZ8Vrv8g2KKuOowikIsVVsdQ8210tSW0raS_rIlIBo-hbp6_kTVHgU-Zv5MSzO_WVdrNk1YXB-JKrLdvsLOgzwxeWUQ67p8FQ-5rc9pPsQqqUZlidaKmL9ydRsAu1c7AlZPypKjjJzDb9emfnJ5r0eyTQLmiCHo-kRKQnv1BzZwob9n7Kq1duJ0VDFecKZguUOOsujGYLQIY-yRMR7eT8-UgHHnWWY_qvGZeNIpu6BWJ94hUdxdYMgu4kJD0fBW-qzIve_k77iaNuG9OjptY9HLGuA-KF0afRfiwXIAshpAxFYVClBbtPCltCewcmh82gDE_9UdeCm3nIMHZTtdFpgNJODWYkpFZ9quapc8WfCpoddcskIK9RJ6cvRgeCkjuw9RmZ7lUAMuiqKIk4D8NSXOiKPzRcEVwm3jTkhwL4X1U0hVV26hYabUdkwPR-pq9BtGM_MFjRsi5Iqx5Wr7ruCAo8M6oxsF5TNsPwxBWGrYdhwESKNrMOdumJDC3Rj2k29hdMYrptTvAup2k95lWb0sB5QVjlCZoZHWxOksK2xsugZ79sEsVUYZBtz5KehEEune667NC5QzLnjpQjgfM1tWuJ0jv4TTGQKGh1VCeHBgOqdB-FGrQUqipZUw7UMOmOMrCHoHeC-ChtuTQ00ZXCsYSbED5045BLnVx0mCZlgaU0M_RPbIvFCflloUz6p45tzL-QN9acuSYFT89OnvS510GP7gY8wF2QtRFyOnhOc9PVVu-gazLGZ7yH5eewQ4fambZbZM00uI_ayvKIwzx5BGmAqQGrTGPRBLpmhFAfLjSool_aarlG-tBhWYC8zDsicmFEXDHNc0hpECaPlJPdtKSXqT3K3aAuBl5uInWtKeYMCgHs8LpoZHzdxrs4jlphTGElfLyNW--plbC3QlwcoUvPbd5YB1gjtN_eRCcCJlUW3TJ4rCZXZz5wAbilBNMi12VGKl0IE9RZZS4MZ2PSaJHUOy3ju_3mxVb7NTyv27zQ8tpq3-Z4-1NszvGaJ7_M8KJZw4s8w4sGubLCGx7048ChNwwNrx_BETc07XfR5_rdGS0e2130Zrvr9H7kdgMZcOwu-kp21_ezYzPh2eGR3fVMydjthoMNzK4_HOlAYyzIgdf1I09YXSf226yuTzbf6QZs8I0u-jSji8ZGd_RSMDhd9FlO16vls4yuX_Hgc9G8z7Vz-hSbi8Y21yf4qz43IP23tbnDU8bl2vPgzSa37--8yfWmFnjcYfsvsrguKzyLi163uGhscYeM3u5we3XyDe7clwi9w3WODA-egdPyfO9ItKcMLgop5J8Ig79F397f2tuOvfWizPhbH5eTlJz45sCzt1M2o3e3Nv6cuQ2ka6a7obv10fk1zK17adLb2oGOra17_AbOtitu2tr6Mw68rRPVe2fyva0qZfu4Fi1WNWV83bgWFz68yeKi1Trexv-PyUWbeL9GyxcopIHDw91NW-DNGt3dodW2_xIYj-PnTAzfIf-cNURkEorW55BdCWlKOJlV2trm5WqBYrDN7xE6rFaH9fq7OD60fdL1Wh9lqhoSt7gNYgbxlibe7Wa3Wd_tISAspYJprQSDpMNECYrTbB_Hi2Wc5wuEaLrYrzbbxZrQJKN0e7dPdvrBkrQmn5pyboX-avz7FjC3oL5R2y1ha37eLdfNCdSX7h-jdp69bbzvZtm-tjwAYumxHOQmAnsFy_QxS_KcpCmVALb7dojmE24lFFYcC55AQ1oDY6YsmwgCGuQFKXTDct5Y-nZ1by3v266bxuuUzUaH-4cZXEmRK37W7ypRIegjencq3v30W44-_PL-nx_F7z-Iv__843q3-hU9n50MxhDuBqwbGPwPA34Dl7qlPqe6qyOKuJEhKgTItD155CC-Wd8TtAUoLJYrDaG79SHeRS__AU5RQDk.GCJpiA.tM7--1mIG_lyG2gZgHB_qAZkN4Q",
    "X-CsrfToken": "lrej1GhlGDLf1qJTYBrMArSQNy53K1zk"
}

let PipelineSingleton;
if (process.env.NODE_ENV !== 'production') {
    // When running in development mode, attach the pipeline to the
    // global object so that it's preserved between hot reloads.
    // For more information, see https://vercel.com/guides/nextjs-prisma-postgres
    if (!global.PipelineSingleton) {
        global.PipelineSingleton = P();
    }
    PipelineSingleton = global.PipelineSingleton;
} else {
    PipelineSingleton = P();
}
module.exports = PipelineSingleton;
