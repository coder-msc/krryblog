package com.krry.service;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.krry.entity.Blog;
import com.krry.entity.Classify;
import com.krry.entity.Params;

/**
 * 业务层
 * @author asusaad
 *
 */
public interface IBlogService {
	
	/**
	 * 分页查询博客、博客总数
	 * @return
	 */
	public HashMap<String, Object> getBlog(Params params);
	
	/**
	 * 获取博客详情页
	 * @return
	 */
	public HashMap<String, Object> getBlogDetail(int id);
	
	/**
	 * 查询博客的分类
	 * @return
	 */
	public HashMap<String, Object> getClassify();
	
	/**
	 * 获取分类博客、博客总数
	 * @return
	 */
	public HashMap<String, Object> getBlogByClassifyId(int id, Params params);
	
	/**
	 * 增加博客
	 * @return
	 */
	public int addBlog(Blog blog);
	
	/**
	 * 修改博客
	 * @param blog
	 */
	public String updateBlog(Blog blog);
	
	/**
	 * 修改博客，不改变 updateTime
	 * @param blog
	 */
	public String updateBlogNoTime(Blog blog);
	
	/**
	 * 删除博客封面
	 * @param id
	 */
	public String deleteBlogCover(int id);
	
}
